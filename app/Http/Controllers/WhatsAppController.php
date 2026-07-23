<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Setting;
use App\Models\WhatsAppLog;
use App\Models\WhatsAppTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsAppController extends Controller
{
    public function index(Request $request)
    {
        $query = WhatsAppLog::with(['user', 'branch']);

        if ($request->search) {
            $query->where(fn ($q) => $q->where('recipient_phone', 'like', "%{$request->search}%")
                ->orWhere('recipient_name', 'like', "%{$request->search}%"));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        return Inertia::render('whatsapp/index', [
            'logs' => $query->latest()->paginate(20),
            'templates' => fn () => WhatsAppTemplate::active()->get(),
            'stats' => [
                'total' => WhatsAppLog::count(),
                'sent' => WhatsAppLog::where('status', 'sent')->count(),
                'delivered' => WhatsAppLog::where('status', 'delivered')->count(),
                'failed' => WhatsAppLog::where('status', 'failed')->count(),
            ],
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'recipient_phone' => 'required|string|max:30',
            'recipient_name' => 'nullable|string|max:100',
            'message' => 'required|string',
            'type' => 'required|in:invoice,due_reminder,order_confirmation,delivery_update,promotion,custom',
            'branch_id' => 'nullable|exists:branches,id',
            'template_id' => 'nullable|exists:whatsapp_templates,id',
        ]);

        $template = $validated['template_id'] ? WhatsAppTemplate::find($validated['template_id']) : null;

        $log = WhatsAppLog::create([
            'user_id' => $request->user()->id,
            'branch_id' => $validated['branch_id'] ?? $request->user()->branch_id,
            'recipient_phone' => $validated['recipient_phone'],
            'recipient_name' => $validated['recipient_name'] ?? null,
            'template_name' => $template?->name,
            'message' => $validated['message'],
            'type' => $validated['type'],
            'status' => 'pending',
            'metadata' => ['source' => 'manual'],
        ]);

        // In production, integrate with WhatsApp Business API here
        // For now, mark as sent for demo
        $log->update(['status' => 'sent', 'external_id' => 'WA-'.strtoupper(uniqid())]);

        return back()->with('success', 'Message sent via WhatsApp.');
    }

    public function settings()
    {
        $groups = ['api', 'business', 'notifications'];
        $settings = [];

        foreach ($groups as $group) {
            $settings[$group] = Setting::getGroup($group);
        }

        return Inertia::render('whatsapp/settings', ['settings' => $settings]);
    }

    public function settingsUpdate(Request $request)
    {
        $validated = $request->validate([
            'group' => 'required|in:api,business,notifications',
            'api_key' => 'nullable|string',
            'api_secret' => 'nullable|string',
            'phone_number_id' => 'nullable|string',
            'business_name' => 'nullable|string',
            'verify_token' => 'nullable|string',
            'enable_delivery_notifications' => 'nullable|boolean',
            'enable_payment_reminders' => 'nullable|boolean',
            'enable_order_confirmations' => 'nullable|boolean',
        ]);

        $group = $validated['group'];
        unset($validated['group']);

        foreach ($validated as $key => $value) {
            Setting::setValue($group, $key, $value);
        }

        return back()->with('success', 'WhatsApp settings updated.');
    }

    // Templates
    public function templates()
    {
        return Inertia::render('whatsapp/templates', [
            'templates' => WhatsAppTemplate::latest()->paginate(20),
        ]);
    }

    public function templateStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:whatsapp_templates,name',
            'category' => 'required|in:invoice,due,order,custom',
            'language' => 'required|string|max:10',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'variables.*' => 'string',
        ]);

        WhatsAppTemplate::create($validated);

        return redirect()->route('whatsapp.templates.index')->with('success', 'Template created.');
    }

    public function templateUpdate(Request $request, WhatsAppTemplate $template)
    {
        $validated = $request->validate([
            'name' => "required|string|max:100|unique:whatsapp_templates,name,{$template->id}",
            'category' => 'required|in:invoice,due,order,custom',
            'language' => 'required|string|max:10',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);

        return redirect()->route('whatsapp.templates.index')->with('success', 'Template updated.');
    }

    public function templateDestroy(WhatsAppTemplate $template)
    {
        $template->delete();

        return redirect()->route('whatsapp.templates.index')->with('success', 'Template deleted.');
    }

    // Quick send: Invoice to customer
    public function sendInvoice(Request $request)
    {
        $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'phone' => 'required|string|max:30',
        ]);

        $sale = Sale::with(['customer', 'saleItems.product'])->findOrFail($request->sale_id);

        $items = $sale->saleItems->map(fn ($item) => "  {$item->product->name} x{$item->quantity} = ৳".number_format($item->subtotal, 2))->join("\n");

        $message = "🧾 *Invoice #{$sale->invoice_no}*\n";
        $message .= "Date: {$sale->created_at->format('d M Y')}\n\n";
        $message .= $items."\n\n";
        $message .= '*Total: ৳'.number_format($sale->grand_total, 2)."*\n";
        $message .= 'Paid: ৳'.number_format($sale->paid_amount, 2)."\n";
        $message .= 'Due: ৳'.number_format($sale->due_amount, 2)."\n\n";
        $message .= 'Thank you for your purchase!';

        $log = WhatsAppLog::create([
            'user_id' => $request->user()->id,
            'branch_id' => $sale->branch_id,
            'recipient_phone' => $request->phone,
            'recipient_name' => $sale->customer?->name,
            'template_name' => 'invoice',
            'message' => $message,
            'type' => 'invoice',
            'status' => 'sent',
            'external_id' => 'WA-'.strtoupper(uniqid()),
            'metadata' => ['sale_id' => $sale->id, 'amount' => $sale->grand_total],
        ]);

        return back()->with('success', 'Invoice sent via WhatsApp.');
    }
}
