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

        $this->call(SampleDataSeeder::class);
    }
}
