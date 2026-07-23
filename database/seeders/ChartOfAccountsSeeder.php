<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class ChartOfAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            // Assets
            ['account_code' => '1000', 'name' => 'Cash', 'type' => 'asset', 'sub_type' => 'cash'],
            ['account_code' => '1010', 'name' => 'Cash at Hand', 'type' => 'asset', 'sub_type' => 'cash_at_hand'],
            ['account_code' => '1020', 'name' => 'Bank Account', 'type' => 'asset', 'sub_type' => 'bank_account'],
            ['account_code' => '1030', 'name' => 'bKash Account', 'type' => 'asset', 'sub_type' => 'bank_account'],
            ['account_code' => '1040', 'name' => 'Nagad Account', 'type' => 'asset', 'sub_type' => 'bank_account'],
            ['account_code' => '1100', 'name' => 'Accounts Receivable', 'type' => 'asset', 'sub_type' => 'receivable'],
            ['account_code' => '1200', 'name' => 'Inventory', 'type' => 'asset', 'sub_type' => 'inventory'],
            ['account_code' => '1300', 'name' => 'Prepaid Expenses', 'type' => 'asset', 'sub_type' => 'prepaid'],
            ['account_code' => '1500', 'name' => 'Equipment', 'type' => 'asset', 'sub_type' => 'fixed_asset'],
            ['account_code' => '1510', 'name' => 'Furniture & Fixtures', 'type' => 'asset', 'sub_type' => 'fixed_asset'],
            ['account_code' => '1520', 'name' => 'Computer & Electronics', 'type' => 'asset', 'sub_type' => 'fixed_asset'],

            // Liabilities
            ['account_code' => '2000', 'name' => 'Accounts Payable', 'type' => 'liability', 'sub_type' => 'payable'],
            ['account_code' => '2100', 'name' => 'Credit Card Payable', 'type' => 'liability', 'sub_type' => 'payable'],
            ['account_code' => '2200', 'name' => 'Sales Tax Payable', 'type' => 'liability', 'sub_type' => 'tax'],
            ['account_code' => '2300', 'name' => 'VAT Payable', 'type' => 'liability', 'sub_type' => 'tax'],
            ['account_code' => '2500', 'name' => 'Loan Payable', 'type' => 'liability', 'sub_type' => 'loan'],
            ['account_code' => '2600', 'name' => 'Customer Deposits', 'type' => 'liability', 'sub_type' => 'deposit'],

            // Equity
            ['account_code' => '3000', 'name' => 'Owner\'s Equity', 'type' => 'equity', 'sub_type' => 'equity'],
            ['account_code' => '3100', 'name' => 'Retained Earnings', 'type' => 'equity', 'sub_type' => 'retained_earnings'],
            ['account_code' => '3200', 'name' => 'Capital', 'type' => 'equity', 'sub_type' => 'capital'],

            // Revenue
            ['account_code' => '4000', 'name' => 'Sales Revenue', 'type' => 'revenue', 'sub_type' => 'sales'],
            ['account_code' => '4100', 'name' => 'Service Revenue', 'type' => 'revenue', 'sub_type' => 'service'],
            ['account_code' => '4200', 'name' => 'Discount Received', 'type' => 'revenue', 'sub_type' => 'discount'],
            ['account_code' => '4300', 'name' => 'Interest Income', 'type' => 'revenue', 'sub_type' => 'interest'],
            ['account_code' => '4400', 'name' => 'Other Income', 'type' => 'revenue', 'sub_type' => 'other'],

            // Expenses
            ['account_code' => '5000', 'name' => 'Cost of Goods Sold', 'type' => 'expense', 'sub_type' => 'cogs'],
            ['account_code' => '5100', 'name' => 'Purchase', 'type' => 'expense', 'sub_type' => 'purchase'],
            ['account_code' => '5200', 'name' => 'Purchase Return', 'type' => 'expense', 'sub_type' => 'purchase_return'],
            ['account_code' => '6000', 'name' => 'Salary Expense', 'type' => 'expense', 'sub_type' => 'salary'],
            ['account_code' => '6100', 'name' => 'Rent Expense', 'type' => 'expense', 'sub_type' => 'rent'],
            ['account_code' => '6200', 'name' => 'Utilities Expense', 'type' => 'expense', 'sub_type' => 'utilities'],
            ['account_code' => '6300', 'name' => 'Telephone & Internet', 'type' => 'expense', 'sub_type' => 'utilities'],
            ['account_code' => '6400', 'name' => 'Transportation Expense', 'type' => 'expense', 'sub_type' => 'transport'],
            ['account_code' => '6500', 'name' => 'Office Supplies', 'type' => 'expense', 'sub_type' => 'office'],
            ['account_code' => '6600', 'name' => 'Marketing Expense', 'type' => 'expense', 'sub_type' => 'marketing'],
            ['account_code' => '6700', 'name' => 'Repair & Maintenance', 'type' => 'expense', 'sub_type' => 'maintenance'],
            ['account_code' => '6800', 'name' => 'Insurance Expense', 'type' => 'expense', 'sub_type' => 'insurance'],
            ['account_code' => '6900', 'name' => 'Depreciation Expense', 'type' => 'expense', 'sub_type' => 'depreciation'],
            ['account_code' => '7000', 'name' => 'Damage & Loss', 'type' => 'expense', 'sub_type' => 'damage'],
        ];

        foreach ($accounts as $account) {
            Account::create($account);
        }
    }
}
