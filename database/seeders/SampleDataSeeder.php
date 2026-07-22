<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $branch1 = Branch::where('name', 'Main Branch')->first();
        $branch2 = Branch::where('name', 'Dhanmondi Branch')->first();
        $admin = User::where('email', 'admin@wsit-pos.com')->first();
        $cashier = User::where('email', 'cashier@wsit-pos.com')->first();

        $this->seedCategories();
        $this->seedSuppliers();
        $this->seedCustomers();
        $this->seedExpenseCategories();
        $this->seedProducts();
        $this->seedSampleSales($branch1, $admin, $cashier);
        $this->seedSamplePurchases($branch1, $admin);
        $this->seedSampleExpenses($branch1, $admin);
    }

    private function seedCategories(): void
    {
        $cats = [
            'Groceries' => ['Rice & Flour', 'Cooking Oil & Spices', 'Pulses & Lentils'],
            'Electronics' => ['Mobile Phones', 'Accessories', 'Computer Parts'],
            'Clothing' => ["Men's Wear", "Women's Wear", 'Kids Wear'],
            'Stationery' => ['Pens & Pencils', 'Notebooks', 'Office Supplies'],
            'Kitchenware' => ['Cooking', 'Storage', 'Cleaning'],
            'Beverages' => ['Soft Drinks', 'Tea & Coffee', 'Juices'],
            'Snacks' => ['Chips & Biscuits', 'Chocolates', 'Namkeen'],
            'Personal Care' => ['Soaps & Body Wash', 'Shampoo', 'Oral Care'],
        ];

        foreach ($cats as $name => $subs) {
            $cat = Category::create(['name' => $name, 'is_active' => true]);
            foreach ($subs as $sub) {
                Category::create(['name' => $sub, 'parent_id' => $cat->id, 'is_active' => true]);
            }
        }
    }

    private function seedSuppliers(): void
    {
        $suppliers = [
            ['name' => 'PRAN RFL Group', 'phone' => '+880 1711-500001', 'email' => 'sales@pranrfl.com', 'company' => 'PRAN RFL Group', 'city' => 'Dhaka', 'address' => 'Uttara, Dhaka'],
            ['name' => 'Marico Bangladesh', 'phone' => '+880 1711-500002', 'email' => 'orders@marico.com', 'company' => 'Marico Bangladesh Ltd', 'city' => 'Dhaka', 'address' => 'Gulshan, Dhaka'],
            ['name' => 'Coca-Cola Bangladesh', 'phone' => '+880 1711-500003', 'email' => 'supply@cocacola-bd.com', 'company' => 'Coca-Cola Bottlers', 'city' => 'Chittagong', 'address' => 'Agrabad, Chittagong'],
            ['name' => 'Unilever Bangladesh', 'phone' => '+880 1711-500004', 'email' => 'trade@unilever-bd.com', 'company' => 'Unilever Bangladesh Ltd', 'city' => 'Dhaka', 'address' => 'Tejgaon, Dhaka'],
            ['name' => 'Bashundhara Group', 'phone' => '+880 1711-500005', 'email' => 'supply@bashundhara.com', 'company' => 'Bashundhara Group', 'city' => 'Dhaka', 'address' => 'Bashundhara R/A, Dhaka'],
            ['name' => 'Square Toiletries', 'phone' => '+880 1711-500006', 'email' => 'orders@square-toiletries.com', 'company' => 'Square Toiletries Ltd', 'city' => 'Dhaka', 'address' => 'Gazipur, Dhaka'],
            ['name' => 'ACI Limited', 'phone' => '+880 1711-500007', 'email' => 'sales@aci-bd.com', 'company' => 'ACI Limited', 'city' => 'Dhaka', 'address' => 'Motijheel, Dhaka'],
            ['name' => 'Nestle Bangladesh', 'phone' => '+880 1711-500008', 'email' => 'supply@nestle-bd.com', 'company' => 'Nestle Bangladesh', 'city' => 'Dhaka', 'address' => 'Gazipur, Dhaka'],
        ];

        foreach ($suppliers as $s) {
            Supplier::create([...$s, 'is_active' => true, 'balance' => 0]);
        }
    }

    private function seedCustomers(): void
    {
        $customers = [
            ['name' => 'Rahim Uddin', 'phone' => '+880 1811-100001', 'city' => 'Dhaka', 'address' => 'Uttara Sector 7'],
            ['name' => 'Salma Begum', 'phone' => '+880 1811-100002', 'city' => 'Dhaka', 'address' => 'Mirpur 10'],
            ['name' => 'Kamal Hossain', 'phone' => '+880 1811-100003', 'city' => 'Dhaka', 'address' => 'Banani 11'],
            ['name' => 'Nargis Akter', 'phone' => '+880 1811-100004', 'city' => 'Dhaka', 'address' => 'Dhanmondi 27'],
            ['name' => 'Abdul Karim', 'phone' => '+880 1811-100005', 'city' => 'Chittagong', 'address' => 'Agrabad'],
            ['name' => 'Fatima Rahman', 'phone' => '+880 1811-100006', 'city' => 'Sylhet', 'address' => 'Zindabazar'],
            ['name' => 'Mohammad Ali', 'phone' => '+880 1811-100007', 'city' => 'Dhaka', 'address' => 'Gulshan 2'],
            ['name' => 'Shirin Sultana', 'phone' => '+880 1811-100008', 'city' => 'Rajshahi', 'address' => 'Boalia'],
            ['name' => 'Hasan Mahbub', 'phone' => '+880 1811-100009', 'city' => 'Dhaka', 'address' => 'Farmgate'],
            ['name' => 'Roksana Parveen', 'phone' => '+880 1811-100010', 'city' => 'Khulna', 'address' => 'Sonadanga'],
            ['name' => 'Bashir Ahmed', 'phone' => '+880 1811-100011', 'city' => 'Dhaka', 'address' => 'Motijheel'],
            ['name' => 'Jesminara Khatun', 'phone' => '+880 1811-100012', 'city' => 'Comilla', 'address' => 'Kandirpar'],
            ['name' => 'Shahidul Islam', 'phone' => '+880 1811-100013', 'city' => 'Dhaka', 'address' => 'Badda'],
            ['name' => 'Anowara Begum', 'phone' => '+880 1811-100014', 'city' => 'Dhaka', 'address' => 'Khilgaon'],
            ['name' => 'Rafiqul Hasan', 'phone' => '+880 1811-100015', 'city' => 'Barisal', 'address' => 'Sadar Road'],
        ];

        foreach ($customers as $i => $c) {
            Customer::create([
                ...$c,
                'is_active' => true,
                'balance' => $i < 5 ? rand(0, 5000) : 0,
                'credit_limit' => rand(0, 5) ? 10000 : 0,
            ]);
        }
    }

    private function seedExpenseCategories(): void
    {
        $cats = ['Rent', 'Utilities', 'Salary', 'Transport', 'Office Supplies', 'Maintenance', 'Marketing', 'Miscellaneous'];
        foreach ($cats as $name) {
            ExpenseCategory::create(['name' => $name]);
        }
    }

    private function seedProducts(): void
    {
        $catGroceries = Category::where('name', 'Rice & Flour')->first();
        $catOil = Category::where('name', 'Cooking Oil & Spices')->first();
        $catPulse = Category::where('name', 'Pulses & Lentils')->first();
        $catSoftDrink = Category::where('name', 'Soft Drinks')->first();
        $catTea = Category::where('name', 'Tea & Coffee')->first();
        $catChips = Category::where('name', 'Chips & Biscuits')->first();
        $catChoco = Category::where('name', 'Chocolates')->first();
        $catSoap = Category::where('name', 'Soaps & Body Wash')->first();
        $catShampoo = Category::where('name', 'Shampoo')->first();
        $catOral = Category::where('name', 'Oral Care')->first();
        $catPen = Category::where('name', 'Pens & Pencils')->first();
        $catNotebook = Category::where('name', 'Notebooks')->first();
        $catCooking = Category::where('name', 'Cooking')->first();
        $catJuice = Category::where('name', 'Juices')->first();
        $catNamkeen = Category::where('name', 'Namkeen')->first();

        $uKg = Unit::where('short_name', 'kg')->first();
        $uLtr = Unit::where('short_name', 'ltr')->first();
        $uPk = Unit::where('short_name', 'pk')->first();
        $uBtl = Unit::where('short_name', 'btl')->first();
        $uPcs = Unit::where('short_name', 'pcs')->first();
        $uBox = Unit::where('short_name', 'box')->first();

        $products = [
            ['sku' => 'GR-001', 'barcode' => '8901234567001', 'name' => 'Miniket Rice Fine', 'category_id' => $catGroceries->id, 'unit_id' => $uKg->id, 'purchase_price' => 65, 'selling_price' => 75, 'stock_quantity' => 500, 'min_stock' => 50, 'tax_rate' => 5],
            ['sku' => 'GR-002', 'barcode' => '8901234567002', 'name' => 'Basmati Rice Premium', 'category_id' => $catGroceries->id, 'unit_id' => $uKg->id, 'purchase_price' => 120, 'selling_price' => 140, 'stock_quantity' => 200, 'min_stock' => 30, 'tax_rate' => 5],
            ['sku' => 'GR-003', 'barcode' => '8901234567003', 'name' => 'Atta Flour PRAN', 'category_id' => $catGroceries->id, 'unit_id' => $uKg->id, 'purchase_price' => 45, 'selling_price' => 55, 'stock_quantity' => 300, 'min_stock' => 40, 'tax_rate' => 5],
            ['sku' => 'OI-001', 'barcode' => '8901234567004', 'name' => 'Soybean Oil Lucky 5L', 'category_id' => $catOil->id, 'unit_id' => $uLtr->id, 'purchase_price' => 580, 'selling_price' => 650, 'stock_quantity' => 80, 'min_stock' => 15, 'tax_rate' => 7.5],
            ['sku' => 'OI-002', 'barcode' => '8901234567005', 'name' => 'Mustard Oil Teer 1L', 'category_id' => $catOil->id, 'unit_id' => $uLtr->id, 'purchase_price' => 180, 'selling_price' => 210, 'stock_quantity' => 100, 'min_stock' => 20, 'tax_rate' => 7.5],
            ['sku' => 'OI-003', 'barcode' => '8901234567006', 'name' => 'Turmeric Powder Radhuni', 'category_id' => $catOil->id, 'unit_id' => $uPk->id, 'purchase_price' => 35, 'selling_price' => 45, 'stock_quantity' => 200, 'min_stock' => 30, 'tax_rate' => 5],
            ['sku' => 'OI-004', 'barcode' => '8901234567007', 'name' => 'Red Chili Powder Radhuni', 'category_id' => $catOil->id, 'unit_id' => $uPk->id, 'purchase_price' => 55, 'selling_price' => 70, 'stock_quantity' => 180, 'min_stock' => 25, 'tax_rate' => 5],
            ['sku' => 'PL-001', 'barcode' => '8901234567008', 'name' => 'Masoor Dal (Red Lentil)', 'category_id' => $catPulse->id, 'unit_id' => $uKg->id, 'purchase_price' => 130, 'selling_price' => 150, 'stock_quantity' => 150, 'min_stock' => 20, 'tax_rate' => 5],
            ['sku' => 'PL-002', 'barcode' => '8901234567009', 'name' => 'Moong Dal (Yellow Lentil)', 'category_id' => $catPulse->id, 'unit_id' => $uKg->id, 'purchase_price' => 140, 'selling_price' => 160, 'stock_quantity' => 120, 'min_stock' => 20, 'tax_rate' => 5],
            ['sku' => 'BK-001', 'barcode' => '8901234567010', 'name' => 'Coca-Cola 1.5L', 'category_id' => $catSoftDrink->id, 'unit_id' => $uBtl->id, 'purchase_price' => 70, 'selling_price' => 85, 'stock_quantity' => 150, 'min_stock' => 20, 'tax_rate' => 15],
            ['sku' => 'BK-002', 'barcode' => '8901234567011', 'name' => 'Pepsi 1.5L', 'category_id' => $catSoftDrink->id, 'unit_id' => $uBtl->id, 'purchase_price' => 70, 'selling_price' => 85, 'stock_quantity' => 120, 'min_stock' => 20, 'tax_rate' => 15],
            ['sku' => 'BK-003', 'barcode' => '8901234567012', 'name' => 'Sprite 500ml', 'category_id' => $catSoftDrink->id, 'unit_id' => $uBtl->id, 'purchase_price' => 25, 'selling_price' => 35, 'stock_quantity' => 200, 'min_stock' => 30, 'tax_rate' => 15],
            ['sku' => 'BK-004', 'barcode' => '8901234567013', 'name' => 'Fanta Orange 500ml', 'category_id' => $catSoftDrink->id, 'unit_id' => $uBtl->id, 'purchase_price' => 25, 'selling_price' => 35, 'stock_quantity' => 180, 'min_stock' => 25, 'tax_rate' => 15],
            ['sku' => 'BK-005', 'barcode' => '8901234567014', 'name' => '7UP 500ml', 'category_id' => $catSoftDrink->id, 'unit_id' => $uBtl->id, 'purchase_price' => 25, 'selling_price' => 35, 'stock_quantity' => 160, 'min_stock' => 25, 'tax_rate' => 15],
            ['sku' => 'TE-001', 'barcode' => '8901234567015', 'name' => 'Brooke Bond Red Label', 'category_id' => $catTea->id, 'unit_id' => $uPk->id, 'purchase_price' => 95, 'selling_price' => 110, 'stock_quantity' => 100, 'min_stock' => 15, 'tax_rate' => 10],
            ['sku' => 'TE-002', 'barcode' => '8901234567016', 'name' => 'Nescafe Classic 50g', 'category_id' => $catTea->id, 'unit_id' => $uPk->id, 'purchase_price' => 280, 'selling_price' => 320, 'stock_quantity' => 60, 'min_stock' => 10, 'tax_rate' => 10],
            ['sku' => 'TE-003', 'barcode' => '8901234567017', 'name' => 'Lipton Yellow Label', 'category_id' => $catTea->id, 'unit_id' => $uPk->id, 'purchase_price' => 110, 'selling_price' => 130, 'stock_quantity' => 80, 'min_stock' => 12, 'tax_rate' => 10],
            ['sku' => 'SN-001', 'barcode' => '8901234567018', 'name' => 'Lays Classic Salted', 'category_id' => $catChips->id, 'unit_id' => $uPk->id, 'purchase_price' => 45, 'selling_price' => 55, 'stock_quantity' => 200, 'min_stock' => 30, 'tax_rate' => 15],
            ['sku' => 'SN-002', 'barcode' => '8901234567019', 'name' => 'Pringles Original', 'category_id' => $catChips->id, 'unit_id' => $uPk->id, 'purchase_price' => 180, 'selling_price' => 210, 'stock_quantity' => 60, 'min_stock' => 10, 'tax_rate' => 15],
            ['sku' => 'SN-003', 'barcode' => '8901234567020', 'name' => 'Oreo Biscuits', 'category_id' => $catChips->id, 'unit_id' => $uPk->id, 'purchase_price' => 35, 'selling_price' => 45, 'stock_quantity' => 250, 'min_stock' => 30, 'tax_rate' => 15],
            ['sku' => 'SN-004', 'barcode' => '8901234567021', 'name' => 'Ruffles Chips 80g', 'category_id' => $catChips->id, 'unit_id' => $uPk->id, 'purchase_price' => 55, 'selling_price' => 68, 'stock_quantity' => 150, 'min_stock' => 20, 'tax_rate' => 15],
            ['sku' => 'CH-001', 'barcode' => '8901234567022', 'name' => 'Cadbury Dairy Milk 85g', 'category_id' => $catChoco->id, 'unit_id' => $uPk->id, 'purchase_price' => 120, 'selling_price' => 140, 'stock_quantity' => 100, 'min_stock' => 15, 'tax_rate' => 15],
            ['sku' => 'PC-001', 'barcode' => '8901234567023', 'name' => 'Lifebuoy Soap Pack', 'category_id' => $catSoap->id, 'unit_id' => $uPk->id, 'purchase_price' => 140, 'selling_price' => 160, 'stock_quantity' => 80, 'min_stock' => 15, 'tax_rate' => 10],
            ['sku' => 'PC-002', 'barcode' => '8901234567024', 'name' => 'Head Shoulders 340ml', 'category_id' => $catShampoo->id, 'unit_id' => $uBtl->id, 'purchase_price' => 290, 'selling_price' => 330, 'stock_quantity' => 50, 'min_stock' => 10, 'tax_rate' => 10],
            ['sku' => 'PC-003', 'barcode' => '8901234567025', 'name' => 'Colgate MaxFresh', 'category_id' => $catOral->id, 'unit_id' => $uPk->id, 'purchase_price' => 85, 'selling_price' => 100, 'stock_quantity' => 100, 'min_stock' => 20, 'tax_rate' => 10],
            ['sku' => 'PC-004', 'barcode' => '8901234567026', 'name' => 'Sunsilk Shampoo 350ml', 'category_id' => $catShampoo->id, 'unit_id' => $uBtl->id, 'purchase_price' => 250, 'selling_price' => 285, 'stock_quantity' => 60, 'min_stock' => 10, 'tax_rate' => 10],
            ['sku' => 'ST-001', 'barcode' => '8901234567027', 'name' => 'Matador Pen Box', 'category_id' => $catPen->id, 'unit_id' => $uBox->id, 'purchase_price' => 280, 'selling_price' => 350, 'stock_quantity' => 40, 'min_stock' => 10, 'tax_rate' => 10],
            ['sku' => 'ST-002', 'barcode' => '8901234567028', 'name' => 'Fixo Notebook 100pp', 'category_id' => $catNotebook->id, 'unit_id' => $uPcs->id, 'purchase_price' => 45, 'selling_price' => 60, 'stock_quantity' => 300, 'min_stock' => 50, 'tax_rate' => 10],
            ['sku' => 'ST-003', 'barcode' => '8901234567029', 'name' => 'Ticon Pencil Box 12', 'category_id' => $catPen->id, 'unit_id' => $uBox->id, 'purchase_price' => 65, 'selling_price' => 85, 'stock_quantity' => 100, 'min_stock' => 20, 'tax_rate' => 10],
            ['sku' => 'BJ-001', 'barcode' => '8901234567030', 'name' => 'Mango Juice PRAN 1L', 'category_id' => $catJuice->id, 'unit_id' => $uBtl->id, 'purchase_price' => 45, 'selling_price' => 55, 'stock_quantity' => 120, 'min_stock' => 20, 'tax_rate' => 15],
            ['sku' => 'KW-001', 'barcode' => '8901234567031', 'name' => 'Non-Stick Frying Pan', 'category_id' => $catCooking->id, 'unit_id' => $uPcs->id, 'purchase_price' => 650, 'selling_price' => 850, 'stock_quantity' => 25, 'min_stock' => 5, 'tax_rate' => 15],
            ['sku' => 'KW-002', 'barcode' => '8901234567032', 'name' => 'Pressure Cooker 5L', 'category_id' => $catCooking->id, 'unit_id' => $uPcs->id, 'purchase_price' => 2500, 'selling_price' => 3200, 'stock_quantity' => 15, 'min_stock' => 5, 'tax_rate' => 15],
            ['sku' => 'KW-003', 'barcode' => '8901234567033', 'name' => 'Nirma Washing Powder', 'category_id' => $catCooking->id, 'unit_id' => $uPk->id, 'purchase_price' => 85, 'selling_price' => 100, 'stock_quantity' => 200, 'min_stock' => 30, 'tax_rate' => 10],
            ['sku' => 'SN-005', 'barcode' => '8901234567034', 'name' => 'Haldiram Namkeen', 'category_id' => $catNamkeen->id, 'unit_id' => $uPk->id, 'purchase_price' => 55, 'selling_price' => 70, 'stock_quantity' => 140, 'min_stock' => 20, 'tax_rate' => 15],
            ['sku' => 'KW-004', 'barcode' => '8901234567035', 'name' => 'Milton Bottle 1L', 'category_id' => $catCooking->id, 'unit_id' => $uPcs->id, 'purchase_price' => 450, 'selling_price' => 600, 'stock_quantity' => 30, 'min_stock' => 5, 'tax_rate' => 15],
        ];

        foreach ($products as $p) {
            Product::create([...$p, 'tax_type' => 'exclusive', 'is_active' => true]);
        }
    }

    private function seedSampleSales($branch, $admin, $cashier): void
    {
        $products = Product::all();
        $customers = Customer::all();
        $methods = ['cash', 'card', 'bkash', 'nagad'];

        for ($d = 30; $d >= 0; $d--) {
            $date = Carbon::today()->subDays($d);
            $salesCount = rand(3, 8);

            for ($i = 0; $i < $salesCount; $i++) {
                $numItems = rand(1, 5);
                $saleItems = $products->random($numItems);
                $subtotal = 0;
                $taxAmount = 0;
                $lineItems = [];

                foreach ($saleItems as $product) {
                    $qty = $product->stock_quantity > 5 ? rand(1, 3) : 1;
                    $itemTotal = $qty * $product->selling_price;
                    $itemTax = $itemTotal * ($product->tax_rate / 100);
                    $subtotal += $itemTotal;
                    $taxAmount += $itemTax;
                    $lineItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'unit_price' => $product->selling_price,
                        'discount' => 0,
                        'tax_amount' => round($itemTax, 2),
                        'total' => round($itemTotal + $itemTax, 2),
                    ];
                }

                $grandTotal = round($subtotal + $taxAmount, 2);
                $paidAmount = rand(0, 1) ? $grandTotal : round($grandTotal * rand(60, 95) / 100, 2);
                $dueAmount = round($grandTotal - $paidAmount, 2);
                $customer = rand(0, 1) ? $customers->random() : null;
                $user = rand(0, 1) ? $admin : $cashier;

                $sale = Sale::create([
                    'branch_id' => $branch->id,
                    'customer_id' => $customer?->id,
                    'user_id' => $user->id,
                    'reference_no' => 'SL-'.strtoupper(Str::random(8)),
                    'invoice_no' => 'INV-'.str_pad((string) Sale::count() + 1, 6, '0', STR_PAD_LEFT),
                    'date' => $date->toDateString(),
                    'subtotal' => round($subtotal, 2),
                    'discount' => 0,
                    'discount_type' => 'fixed',
                    'tax_amount' => round($taxAmount, 2),
                    'shipping_cost' => 0,
                    'grand_total' => $grandTotal,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'payment_method' => $methods[array_rand($methods)],
                    'status' => 'completed',
                ]);

                foreach ($lineItems as $li) {
                    SaleItem::create(['sale_id' => $sale->id, ...$li]);
                }

                if ($customer && $dueAmount > 0) {
                    $customer->increment('balance', $dueAmount);
                }
            }
        }
    }

    private function seedSamplePurchases($branch, $admin): void
    {
        $suppliers = Supplier::all();
        $products = Product::all();

        for ($d = 60; $d >= 0; $d += rand(3, 7)) {
            $date = Carbon::today()->subDays($d);
            $numItems = rand(3, 8);
            $items = $products->random($numItems);
            $total = 0;
            $lineItems = [];

            foreach ($items as $product) {
                $qty = rand(10, 50);
                $itemTotal = $qty * $product->purchase_price;
                $total += $itemTotal;
                $lineItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit_price' => $product->purchase_price,
                    'discount' => 0,
                    'tax_amount' => 0,
                    'total' => round($itemTotal, 2),
                ];
            }

            $grandTotal = round($total, 2);
            $paidAmount = rand(0, 1) ? $grandTotal : round($grandTotal * 0.6, 2);

            $purchase = Purchase::create([
                'branch_id' => $branch->id,
                'supplier_id' => $suppliers->random()->id,
                'user_id' => $admin->id,
                'reference_no' => 'PUR-'.strtoupper(Str::random(8)),
                'date' => $date->toDateString(),
                'total' => $total,
                'discount' => 0,
                'tax_amount' => 0,
                'shipping_cost' => 0,
                'grand_total' => $grandTotal,
                'paid_amount' => round($paidAmount, 2),
                'due_amount' => round($grandTotal - $paidAmount, 2),
                'status' => 'received',
            ]);

            foreach ($lineItems as $li) {
                PurchaseItem::create(['purchase_id' => $purchase->id, ...$li]);
            }
        }
    }

    private function seedSampleExpenses($branch, $admin): void
    {
        $categories = ExpenseCategory::all();
        $titles = [
            'Rent Payment', 'Electricity Bill', 'Internet Bill', 'Staff Salary',
            'Office Cleaning', 'Delivery Van Fuel', 'Printer Maintenance',
            'Staff Lunch', 'AC Maintenance', 'Security Guard Salary',
            'Packaging Materials', 'Marketing Flyers', 'Water Bill', 'Phone Bill',
        ];

        for ($d = 30; $d >= 0; $d--) {
            $date = Carbon::today()->subDays($d);
            $count = rand(0, 3);

            for ($i = 0; $i < $count; $i++) {
                $cat = $categories->random();
                $amount = match ($cat->name) {
                    'Rent' => 25000,
                    'Salary' => rand(8000, 25000),
                    'Utilities' => rand(2000, 8000),
                    default => rand(200, 5000),
                };

                Expense::create([
                    'branch_id' => $branch->id,
                    'expense_category_id' => $cat->id,
                    'user_id' => $admin->id,
                    'title' => $titles[array_rand($titles)],
                    'amount' => $amount,
                    'date' => $date->toDateString(),
                    'payment_method' => $cat->name === 'Salary' ? 'bank_transfer' : 'cash',
                ]);
            }
        }
    }
}
