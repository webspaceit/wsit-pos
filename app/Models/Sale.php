<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $branch_id
 * @property int|null $customer_id
 * @property int $user_id
 * @property string $reference_no
 * @property string $invoice_no
 * @property string $date
 * @property float $subtotal
 * @property float $discount
 * @property string $discount_type
 * @property float $tax_amount
 * @property float $shipping_cost
 * @property float $grand_total
 * @property float $paid_amount
 * @property float $due_amount
 * @property string $payment_method
 * @property string $status
 * @property string|null $notes
 */
class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'customer_id', 'user_id', 'reference_no', 'invoice_no', 'date',
        'subtotal', 'discount', 'discount_type', 'tax_amount', 'shipping_cost',
        'grand_total', 'paid_amount', 'due_amount', 'payment_method', 'status', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Sale $sale) {
            if (empty($sale->reference_no)) {
                $sale->reference_no = 'SL-'.strtoupper(Str::random(8));
            }
            if (empty($sale->invoice_no)) {
                $maxInvoice = static::max('id') + 1;
                $sale->invoice_no = 'INV-'.str_pad((string) $maxInvoice, 6, '0', STR_PAD_LEFT);
            }
        });

        static::deleted(function (Sale $sale) {
            foreach ($sale->items as $item) {
                $product = $item->product;
                $product->increment('stock_quantity', $item->quantity);
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function scopeByBranch($query, ?int $branchId)
    {
        return $branchId ? $query->where('branch_id', $branchId) : $query;
    }

    public function scopeByDateRange($query, ?string $from, ?string $to)
    {
        if ($from) {
            $query->where('date', '>=', $from);
        }
        if ($to) {
            $query->where('date', '<=', $to);
        }

        return $query;
    }

    public function scopeStatus($query, ?string $status)
    {
        return $status ? $query->where('status', $status) : $query;
    }
}
