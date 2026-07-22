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
            ['key' => 'hero_title', 'value' => 'Modern POS System for Bangladesh', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'value' => 'Streamline your retail business with our powerful, easy-to-use point of sale system. Built specifically for Bangladesh with BDT support, bKash, Nagad, and local payment methods.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'hero_cta_text', 'value' => 'Get Started Free', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'features_title', 'value' => 'Everything You Need to Run Your Store', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'features_subtitle', 'value' => 'Powerful features designed for Bangladeshi retailers', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'features', 'value' => json_encode([
                ['icon' => 'ShoppingCart', 'title' => 'POS Terminal', 'description' => 'Fast, intuitive checkout with barcode scanning, keyboard shortcuts, and real-time inventory updates.'],
                ['icon' => 'Package', 'title' => 'Inventory Management', 'description' => 'Track stock levels, set minimum thresholds, and get low-stock alerts across all branches.'],
                ['icon' => 'Users', 'title' => 'Customer Management', 'description' => 'Maintain customer profiles, track purchase history, and manage credit accounts with due collection.'],
                ['icon' => 'Truck', 'title' => 'Supplier & Purchasing', 'description' => 'Manage suppliers, create purchase orders, and track deliveries with automatic stock updates.'],
                ['icon' => 'BarChart3', 'title' => 'Reports & Analytics', 'description' => 'Sales reports, profit/loss analysis, stock reports, tax reports, and customer due summaries.'],
                ['icon' => 'Building2', 'title' => 'Multi-Branch Support', 'description' => 'Manage multiple branches from a single dashboard with branch-specific inventory and reporting.'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'pricing_title', 'value' => 'Simple, Transparent Pricing', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'pricing_subtitle', 'value' => 'No hidden fees. Choose the plan that fits your business.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'pricing', 'value' => json_encode([
                ['name' => 'Starter', 'price' => '1,500', 'period' => '/month', 'description' => 'Perfect for small shops', 'features' => ['1 Branch', '1 User', '100 Products', 'Basic Reports', 'Email Support'], 'highlighted' => false],
                ['name' => 'Professional', 'price' => '3,500', 'period' => '/month', 'description' => 'For growing businesses', 'features' => ['3 Branches', '5 Users', 'Unlimited Products', 'Advanced Reports', 'Priority Support', 'bKash/Nagad Integration'], 'highlighted' => true],
                ['name' => 'Enterprise', 'price' => '7,500', 'period' => '/month', 'description' => 'For large operations', 'features' => ['Unlimited Branches', 'Unlimited Users', 'Unlimited Products', 'Custom Reports', '24/7 Support', 'API Access', 'Custom Integrations'], 'highlighted' => false],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'testimonials_title', 'value' => 'Trusted by Bangladeshi Businesses', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'testimonials', 'value' => json_encode([
                ['name' => 'Rahim Uddin', 'role' => 'Owner, Rahim Store', 'text' => 'This POS system transformed how I manage my grocery store in Dhaka. The bKash integration is seamless!'],
                ['name' => 'Salma Begum', 'role' => 'Manager, Fashion Hub', 'text' => 'Multi-branch support helps us track all our outlets from one place. Customer management is excellent.'],
                ['name' => 'Kamal Hossain', 'role' => 'Owner, TechZone', 'text' => 'The best investment for our electronics shop. Reports give us clear insights into our business performance.'],
            ]), 'group' => 'landing', 'type' => 'json'],
            ['key' => 'cta_title', 'value' => 'Ready to Transform Your Business?', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'cta_subtitle', 'value' => 'Join hundreds of Bangladeshi businesses already using our POS system. Start your free trial today.', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'cta_button_text', 'value' => 'Start Free Trial', 'group' => 'landing', 'type' => 'text'],
            ['key' => 'footer_text', 'value' => 'WebSpace IT POS - Built for Bangladesh', 'group' => 'landing', 'type' => 'text'],
        ];

        foreach ($landing as $item) {
            Setting::create($item);
        }

        $this->call(SampleDataSeeder::class);
    }
}
