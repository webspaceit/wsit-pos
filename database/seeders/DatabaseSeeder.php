<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $roles = ['admin', 'manager', 'cashier'];
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        $units = [
            ['name' => 'Piece', 'short_name' => 'pcs'],
            ['name' => 'Kilogram', 'short_name' => 'kg'],
            ['name' => 'Gram', 'short_name' => 'g'],
            ['name' => 'Litre', 'short_name' => 'ltr'],
            ['name' => 'Millilitre', 'short_name' => 'ml'],
            ['name' => 'Box', 'short_name' => 'box'],
            ['name' => 'Dozen', 'short_name' => 'dz'],
            ['name' => 'Set', 'short_name' => 'set'],
            ['name' => 'Pair', 'short_name' => 'pair'],
            ['name' => 'Pack', 'short_name' => 'pk'],
            ['name' => 'Carton', 'short_name' => 'ctn'],
            ['name' => 'Bag', 'short_name' => 'bag'],
            ['name' => 'Roll', 'short_name' => 'roll'],
            ['name' => 'Bottle', 'short_name' => 'btl'],
            ['name' => 'Can', 'short_name' => 'can'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }

        $branch = Branch::create([
            'name' => 'Main Branch',
            'address' => 'Dhaka, Bangladesh',
            'is_active' => true,
        ]);

        Branch::create([
            'name' => 'Dhanmondi Branch',
            'address' => 'Dhanmondi, Dhaka',
            'is_active' => true,
        ]);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@wsit-pos.com',
            'password' => Hash::make('password'),
            'branch_id' => $branch->id,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());

        $cashier = User::create([
            'name' => 'Cashier',
            'email' => 'cashier@wsit-pos.com',
            'password' => Hash::make('password'),
            'branch_id' => $branch->id,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $cashier->roles()->attach(Role::where('name', 'cashier')->first());

        $settings = [
            ['key' => 'business_name', 'value' => 'My POS Store', 'group' => 'business'],
            ['key' => 'business_address', 'value' => 'Dhaka, Bangladesh', 'group' => 'business'],
            ['key' => 'business_phone', 'value' => '+880 1XXXXXXXXX', 'group' => 'business'],
            ['key' => 'business_email', 'value' => 'info@myposstore.com', 'group' => 'business'],
            ['key' => 'tax_number', 'value' => '', 'group' => 'business'],
            ['key' => 'tax_rate', 'value' => '15', 'group' => 'business'],
            ['key' => 'currency', 'value' => 'BDT', 'group' => 'business'],
            ['key' => 'currency_symbol', 'value' => '৳', 'group' => 'business'],
            ['key' => 'receipt_footer', 'value' => 'Thank you for your purchase!', 'group' => 'business'],
            ['key' => 'invoice_prefix', 'value' => 'INV-', 'group' => 'business'],
            ['key' => 'low_stock_threshold', 'value' => '10', 'group' => 'business'],
            ['key' => 'timezone', 'value' => 'Asia/Dhaka', 'group' => 'business'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        $landing = [
            ['key' => 'logo_text', 'value' => 'WSIT POS', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'nav_links', 'value' => json_encode([
                ['label' => 'Features', 'href' => '#features'],
                ['label' => 'Pricing', 'href' => '#pricing'],
                ['label' => 'Testimonials', 'href' => '#testimonials'],
                ['label' => 'FAQ', 'href' => '#faq'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'hero_title', 'value' => 'The #1 POS System Built for Bangladesh', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'value' => 'Run your retail business smarter with real-time inventory, bKash/Nagad payments, multi-branch management, and powerful analytics — all in one platform designed exclusively for Bangladeshi businesses.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'hero_cta_text', 'value' => 'Start Free Trial', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'stats_title', 'value' => 'Trusted by Thousands of Businesses', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'stats_subtitle', 'value' => 'Join the growing community of Bangladeshi retailers who trust WSIT POS', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'stats', 'value' => json_encode([
                ['value' => '2,500+', 'label' => 'Active Businesses'],
                ['value' => '15M+', 'label' => 'Transactions Processed'],
                ['value' => '৳850Cr+', 'label' => 'Sales Managed'],
                ['value' => '99.9%', 'label' => 'Uptime Guarantee'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'logos_title', 'value' => 'Trusted by Leading Brands', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'logos', 'value' => json_encode([
                'Shwapno', 'Agora', 'Meena Bazar', 'Unimart', 'Chaldal', 'Pandamart',
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'features_title', 'value' => 'Everything You Need to Run Your Store', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'features_subtitle', 'value' => 'Powerful features designed for the way Bangladeshi retailers do business', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'features', 'value' => json_encode([
                ['icon' => 'ShoppingCart', 'title' => 'Lightning-Fast POS', 'description' => 'Process checkout in seconds with barcode scanning, keyboard shortcuts, and touch-friendly interface. Support for cash, bKash, Nagad, Rocket, and card payments.'],
                ['icon' => 'Package', 'title' => 'Smart Inventory', 'description' => 'Track stock across branches in real-time. Set reorder points, get low-stock alerts, and never run out of bestsellers. Auto-deduction on every sale.'],
                ['icon' => 'Users', 'title' => 'Customer & Due Management', 'description' => 'Build customer profiles, track purchase history, and manage credit accounts. Send SMS reminders for due collections and generate due statements instantly.'],
                ['icon' => 'Truck', 'title' => 'Supplier & Purchase Orders', 'description' => 'Manage your supplier network, create purchase orders, record deliveries, and track outstanding payments — all with automatic stock updates on receipt.'],
                ['icon' => 'BarChart3', 'title' => 'Business Intelligence', 'description' => 'Sales reports, profit/loss analysis, tax breakdowns, stock summaries, and customer due reports. Make data-driven decisions with real-time dashboards.'],
                ['icon' => 'Building2', 'title' => 'Multi-Branch Control', 'description' => 'Manage unlimited branches from a single dashboard. Branch-specific inventory, sales tracking, and performance comparison across all your outlets.'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'pricing_title', 'value' => 'Simple, Transparent Pricing', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'pricing_subtitle', 'value' => 'No hidden fees. No long-term contracts. Choose the plan that fits your business.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'pricing', 'value' => json_encode([
                ['name' => 'Starter', 'price' => '1,500', 'period' => '/month', 'description' => 'Perfect for single shops & small retailers', 'features' => ['1 Branch', '1 User', '100 Products', 'Basic Reports', 'bKash/Nagad Payments', 'Email Support'], 'highlighted' => false],
                ['name' => 'Professional', 'price' => '3,500', 'period' => '/month', 'description' => 'For growing businesses with multiple branches', 'features' => ['3 Branches', '5 Users', 'Unlimited Products', 'Advanced Reports', 'Priority Support', 'bKash/Nagad/Rocket Integration', 'Customer Due Management', 'SMS Notifications'], 'highlighted' => true],
                ['name' => 'Enterprise', 'price' => '7,500', 'period' => '/month', 'description' => 'For large operations & chain stores', 'features' => ['Unlimited Branches', 'Unlimited Users', 'Unlimited Products', 'Custom Reports & Analytics', '24/7 Phone Support', 'API Access', 'Custom Integrations', 'Dedicated Account Manager', 'White-label Options'], 'highlighted' => false],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'testimonials_title', 'value' => 'What Our Customers Say', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'testimonials', 'value' => json_encode([
                ['name' => 'Rahim Uddin', 'role' => 'Owner, Rahim Superstore — Gulshan', 'text' => 'We switched from manual registers to WSIT POS and our checkout speed tripled. The bKash integration is flawless — our customers love it. Inventory tracking across two branches has never been easier.'],
                ['name' => 'Salma Begum', 'role' => 'Operations Manager, Fashion Hub — Dhanmondi', 'text' => 'Managing 3 fashion outlets used to be a nightmare. With WSIT POS, I can see real-time sales from all branches, compare performance, and restock intelligently. The due collection reports alone saved us ৳5 lakhs last quarter.'],
                ['name' => 'Kamal Hossain', 'role' => 'CEO, TechZone Electronics — Banani', 'text' => 'The best investment we made for our electronics chain. The profit/loss reports give us crystal-clear insights. Customer management features help us run targeted promotions that actually work.'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'faq_title', 'value' => 'Frequently Asked Questions', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'faq_subtitle', 'value' => 'Everything you need to know about getting started', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'faq', 'value' => json_encode([
                ['question' => 'How long is the free trial?', 'answer' => 'We offer a 14-day free trial with full access to all features. No credit card required. Simply sign up, add your products, and start selling.'],
                ['question' => 'Does it support bKash and Nagad payments?', 'answer' => 'Yes! We have built-in support for bKash, Nagad, Rocket, and traditional cash payments. Card payments are also supported through our payment gateway partners.'],
                ['question' => 'Can I manage multiple branches?', 'answer' => 'Absolutely. The Professional plan supports up to 3 branches and the Enterprise plan supports unlimited branches. Each branch has its own inventory, users, and reporting — all managed from a single dashboard.'],
                ['question' => 'Is my data safe and secure?', 'answer' => 'Yes. We use bank-level encryption (AES-256), automatic daily backups, and our servers are hosted in secure data centers in Bangladesh. Your data is always yours and can be exported at any time.'],
                ['question' => 'Do you offer training and onboarding?', 'answer' => 'Yes! Professional and Enterprise plans include free onboarding sessions. We provide video tutorials, documentation, and our support team is available via phone, email, and live chat.'],
                ['question' => 'Can I import my existing product data?', 'answer' => 'Yes. You can bulk-import products, customers, and suppliers using our Excel/CSV import tool. Our team can also assist with data migration from other POS systems.'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'cta_title', 'value' => 'Ready to Transform Your Business?', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'cta_subtitle', 'value' => 'Join 2,500+ Bangladeshi businesses already using WSIT POS to streamline operations, boost sales, and grow faster. Start your free 14-day trial today — no credit card required.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'cta_button_text', 'value' => 'Start Free 14-Day Trial', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'footer_text', 'value' => 'WebSpace IT POS — Built for Bangladesh', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'footer_copyright', 'value' => '© '.date('Y').' WebSpace IT. All rights reserved.', 'group' => 'landing', 'type' => 'text'],
        ];

        foreach ($landing as $item) {
            Setting::create($item);
        }

        $this->call(ChartOfAccountsSeeder::class);
        $this->call(SampleDataSeeder::class);
        $this->call(FullSampleSeeder::class);
    }
}
