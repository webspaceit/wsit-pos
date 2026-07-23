<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Models\DamageStock;
use App\Models\DiscountPlan;
use App\Models\Employee;
use App\Models\GiftCard;
use App\Models\Income;
use App\Models\IncomeCategory;
use App\Models\InstallmentPlan;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\Recipe;
use App\Models\RecipeItem;
use App\Models\RepairTicket;
use App\Models\RewardPoint;
use App\Models\Salary;
use App\Models\Sale;
use App\Models\User;
use App\Models\WhatsAppLog;
use App\Models\WhatsAppTemplate;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FullSampleSeeder extends Seeder
{
    public function run(): void
    {
        $branch1 = Branch::where('name', 'Main Branch')->first();
        $branch2 = Branch::where('name', 'Dhanmondi Branch')->first();
        $admin = User::where('email', 'admin@wsit-pos.com')->first();

        $this->seedBrands();
        $this->seedEmployees($branch1, $branch2);
        $this->seedAttendances();
        $this->seedSalaries();
        $this->seedRecipes();
        $this->seedProductionOrders($branch1, $admin);
        $this->seedRepairTickets($branch1, $admin);
        $this->seedProjects($branch1);
        $this->seedProjectTasks();
        $this->seedIncomeCategories();
        $this->seedIncomes($branch1, $admin);
        $this->seedInstallments($branch1, $admin);
        $this->seedGiftCards($branch1, $admin);
        $this->seedCoupons();
        $this->seedDamageStock($branch1, $admin);
        $this->seedDiscountPlans();
        $this->seedCustomerGroups();
        $this->seedRewardPoints();
        $this->seedJournalEntries($admin);
        $this->seedWhatsAppTemplates();
        $this->seedWhatsAppLogs($branch1, $admin);
    }

    private function seedBrands(): void
    {
        $brands = ['PRAN', 'Coca-Cola', 'Nestle', 'Unilever', 'Square', 'Marico', 'ACI', 'PepsiCo', 'Lays', 'Brooke Bond'];
        foreach ($brands as $name) {
            Brand::firstOrCreate(['name' => $name], ['is_active' => true]);
        }
    }

    private function seedEmployees($b1, $b2): void
    {
        $employees = [
            ['name' => 'Karim Rahman', 'email' => 'karim@wsit-pos.com', 'phone' => '+8801711-100001', 'position' => 'Store Manager', 'branch_id' => $b1->id, 'salary' => 35000, 'status' => 'active'],
            ['name' => 'Fatima Begum', 'email' => 'fatima@wsit-pos.com', 'phone' => '+8801711-100002', 'position' => 'Senior Cashier', 'branch_id' => $b1->id, 'salary' => 22000, 'status' => 'active'],
            ['name' => 'Rafiq Hasan', 'email' => 'rafiq@wsit-pos.com', 'phone' => '+8801711-100003', 'position' => 'Cashier', 'branch_id' => $b1->id, 'salary' => 18000, 'status' => 'active'],
            ['name' => 'Nargis Akter', 'email' => 'nargis@wsit-pos.com', 'phone' => '+8801711-100004', 'position' => 'Inventory Clerk', 'branch_id' => $b1->id, 'salary' => 16000, 'status' => 'active'],
            ['name' => 'Shahin Alam', 'email' => 'shahin@wsit-pos.com', 'phone' => '+8801711-100005', 'position' => 'Store Manager', 'branch_id' => $b2->id, 'salary' => 32000, 'status' => 'active'],
            ['name' => 'Roksana Parveen', 'email' => 'roksana@wsit-pos.com', 'phone' => '+8801711-100006', 'position' => 'Cashier', 'branch_id' => $b2->id, 'salary' => 17000, 'status' => 'active'],
            ['name' => 'Monirul Islam', 'email' => 'monirul@wsit-pos.com', 'phone' => '+8801711-100007', 'position' => 'Delivery Staff', 'branch_id' => $b1->id, 'salary' => 15000, 'status' => 'active'],
            ['name' => 'Jesminara Khatun', 'email' => 'jesmin@wsit-pos.com', 'phone' => '+8801711-100008', 'position' => 'Accountant', 'branch_id' => $b1->id, 'salary' => 28000, 'status' => 'active'],
            ['name' => 'Abdul Hakim', 'email' => 'hakim@wsit-pos.com', 'phone' => '+8801711-100009', 'position' => 'Helper', 'branch_id' => $b2->id, 'salary' => 12000, 'status' => 'inactive'],
            ['name' => 'Sumaiya Rahman', 'email' => 'sumaiya@wsit-pos.com', 'phone' => '+8801711-100010', 'position' => 'Sales Executive', 'branch_id' => $b1->id, 'salary' => 20000, 'status' => 'active'],
        ];

        foreach ($employees as $e) {
            Employee::create([...$e, 'join_date' => Carbon::now()->subMonths(rand(3, 24))->toDateString(), 'address' => 'Dhaka, Bangladesh']);
        }
    }

    private function seedAttendances(): void
    {
        $employees = Employee::where('status', 'active')->get();
        $statuses = ['present', 'present', 'present', 'late', 'present', 'half_day'];

        for ($d = 20; $d >= 0; $d--) {
            $date = Carbon::today()->subDays($d);
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($employees as $emp) {
                if (rand(1, 10) <= 2) {
                    continue;
                }
                $status = $statuses[array_rand($statuses)];
                $clockIn = $status === 'late' ? '09:'.str_pad((string) rand(10, 45), 2, '0', STR_PAD_LEFT) : '08:'.str_pad((string) rand(30, 59), 2, '0', STR_PAD_LEFT);
                $clockOut = '17:'.str_pad((string) rand(0, 59), 2, '0', STR_PAD_LEFT);
                $hours = $status === 'half_day' ? 4 : ($status === 'absent' ? 0 : 8 + (rand(0, 30) / 60));

                Attendance::create([
                    'employee_id' => $emp->id,
                    'date' => $date->toDateString(),
                    'clock_in' => $clockIn,
                    'clock_out' => $clockOut,
                    'status' => $status,
                    'hours_worked' => round($hours, 2),
                ]);
            }
        }
    }

    private function seedSalaries(): void
    {
        $employees = Employee::where('status', 'active')->get();
        $month = Carbon::now()->subMonth()->format('Y-m');

        foreach ($employees as $emp) {
            $baseSalary = $emp->salary;
            $bonus = rand(0, 1) ? rand(500, 2000) : 0;
            $deductions = rand(0, 1) ? rand(200, 1000) : 0;
            $net = $baseSalary + $bonus - $deductions;

            Salary::create([
                'employee_id' => $emp->id,
                'month' => $month,
                'base_salary' => $baseSalary,
                'bonus' => $bonus,
                'deductions' => $deductions,
                'net_salary' => $net,
                'status' => 'paid',
                'paid_amount' => $net,
                'paid_date' => Carbon::now()->subMonth()->day(28)->toDateString(),
            ]);
        }
    }

    private function seedRecipes(): void
    {
        $rice = Product::where('name', 'like', '%Miniket%')->first();
        $flour = Product::where('name', 'like', '%Atta Flour%')->first();
        $noodles = Product::where('name', 'like', '%Nirma%')->first();

        if (! $rice) {
            return;
        }

        $r1 = Recipe::create(['product_id' => $rice->id, 'name' => 'Rice Pack 5kg', 'yield_quantity' => 5, 'notes' => 'Pre-packed 5kg rice bundle', 'is_active' => true]);
        RecipeItem::create(['recipe_id' => $r1->id, 'product_id' => $rice->id, 'quantity' => 5, 'unit_cost' => 65]);
        if ($noodles) {
            RecipeItem::create(['recipe_id' => $r1->id, 'product_id' => $noodles->id, 'quantity' => 1, 'unit_cost' => 85]);
        }

        if ($flour) {
            $r2 = Recipe::create(['product_id' => $flour->id, 'name' => 'Flour Combo Pack', 'yield_quantity' => 3, 'notes' => '3-pack flour combo', 'is_active' => true]);
            RecipeItem::create(['recipe_id' => $r2->id, 'product_id' => $flour->id, 'quantity' => 3, 'unit_cost' => 45]);
        }
    }

    private function seedProductionOrders($branch, $admin): void
    {
        $recipes = Recipe::all();
        if ($recipes->isEmpty()) {
            return;
        }

        $statuses = ['pending', 'in_progress', 'completed'];
        foreach ($statuses as $i => $status) {
            $recipe = $recipes->random();
            $qtyToProduce = rand(5, 20);
            ProductionOrder::create([
                'recipe_id' => $recipe->id,
                'branch_id' => $branch->id,
                'user_id' => $admin->id,
                'reference_no' => 'PO-'.strtoupper(substr(uniqid(), -8)),
                'date' => Carbon::now()->subDays(rand(1, 10))->toDateString(),
                'quantity_to_produce' => $qtyToProduce,
                'quantity_produced' => $status === 'completed' ? $qtyToProduce : ($status === 'in_progress' ? rand(1, 5) : 0),
                'total_cost' => rand(2000, 15000),
                'status' => $status,
            ]);
        }
    }

    private function seedRepairTickets($branch, $admin): void
    {
        $customers = Customer::all();
        if ($customers->isEmpty()) {
            return;
        }

        $devices = [
            ['type' => 'Laptop', 'brand' => 'HP', 'model' => 'Pavilion 15'],
            ['type' => 'Mobile Phone', 'brand' => 'Samsung', 'model' => 'Galaxy A54'],
            ['type' => 'Desktop', 'brand' => 'Dell', 'model' => 'OptiPlex 7090'],
            ['type' => 'Printer', 'brand' => 'Canon', 'model' => 'PIXMA G3010'],
            ['type' => 'Mobile Phone', 'brand' => 'Xiaomi', 'model' => 'Redmi Note 12'],
            ['type' => 'Laptop', 'brand' => 'Lenovo', 'model' => 'IdeaPad 3'],
            ['type' => 'Tablet', 'brand' => 'Apple', 'model' => 'iPad 10th Gen'],
        ];
        $statuses = ['received', 'diagnosed', 'in_repair', 'ready', 'delivered'];

        foreach ($devices as $i => $d) {
            $estCost = rand(1500, 8000);
            $advance = rand(0, 1) ? rand(500, $estCost) : 0;
            $status = $statuses[$i % count($statuses)];

            RepairTicket::create([
                'branch_id' => $branch->id,
                'customer_id' => $customers->random()->id,
                'user_id' => $admin->id,
                'ticket_no' => 'RPR-'.strtoupper(Str::random(8)),
                'date' => Carbon::now()->subDays(rand(1, 15))->toDateString(),
                'device_type' => $d['type'],
                'device_brand' => $d['brand'],
                'device_model' => $d['model'],
                'serial_number' => strtoupper(uniqid('SN-')),
                'issue_description' => $this->randomIssue($d['type']),
                'estimated_cost' => $estCost,
                'actual_cost' => $status === 'ready' || $status === 'delivered' ? $estCost + rand(-500, 1000) : 0,
                'advance_paid' => $advance,
                'status' => $status,
                'estimated_delivery' => Carbon::now()->addDays(rand(2, 7))->toDateString(),
                'technician_notes' => in_array($status, ['diagnosed', 'in_repair', 'ready']) ? 'Issue identified. Parts available.' : null,
            ]);
        }
    }

    private function randomIssue(string $type): string
    {
        return match ($type) {
            'Laptop' => ['Screen flickering frequently', 'Battery drains in 30 minutes', 'Keyboard keys not responding', 'Overheating during use'][rand(0, 3)],
            'Mobile Phone' => ['Cracked screen - needs replacement', 'Charging port loose', 'Camera not focusing', 'Speaker producing crackling sound'][rand(0, 3)],
            'Desktop' => ['Blue screen error on startup', 'Hard drive making clicking noise', 'RAM upgrade requested', 'Power supply not working'][rand(0, 3)],
            'Printer' => ['Paper jamming continuously', 'Print quality poor - streaks', 'Not detecting ink cartridges', 'WiFi connection dropped'][rand(0, 3)],
            'Tablet' => ['Touchscreen unresponsive in corner', 'Battery swelling', 'Unable to charge', 'Screen cracked'][rand(0, 3)],
            default => 'General malfunction - needs diagnosis',
        };
    }

    private function seedProjects($branch): void
    {
        $customers = Customer::all();

        $projects = [
            ['name' => 'Website Redesign', 'description' => 'Complete redesign of company website with modern UI/UX', 'budget' => 150000, 'status' => 'in_progress', 'progress' => 65],
            ['name' => 'Mobile App Development', 'description' => 'Build iOS and Android apps for customer loyalty program', 'budget' => 500000, 'status' => 'planning', 'progress' => 10],
            ['name' => 'Store Renovation - Dhanmondi', 'description' => 'Interior renovation and new shelf installation', 'budget' => 300000, 'status' => 'in_progress', 'progress' => 40],
            ['name' => 'Inventory System Migration', 'description' => 'Migrate from old system to new POS inventory module', 'budget' => 75000, 'status' => 'completed', 'progress' => 100],
            ['name' => 'Staff Training Program', 'description' => 'Comprehensive training for all staff on new POS system', 'budget' => 50000, 'status' => 'in_progress', 'progress' => 80],
            ['name' => 'New Branch Setup - Uttara', 'description' => 'Set up new branch including furniture, IT infrastructure, and initial stock', 'budget' => 800000, 'status' => 'planning', 'progress' => 5],
        ];

        foreach ($projects as $p) {
            Project::create([
                ...$p,
                'code' => 'PRJ-'.strtoupper(Str::random(6)),
                'branch_id' => $branch->id,
                'customer_id' => $customers->isNotEmpty() && rand(0, 1) ? $customers->random()->id : null,
                'start_date' => Carbon::now()->subDays(rand(10, 60))->toDateString(),
                'end_date' => Carbon::now()->addDays(rand(30, 120))->toDateString(),
            ]);
        }
    }

    private function seedProjectTasks(): void
    {
        $projects = Project::all();
        $employees = Employee::where('status', 'active')->get();
        if ($employees->isEmpty()) {
            return;
        }

        $taskTemplates = [
            'in_progress' => [
                ['title' => 'Requirements gathering', 'status' => 'done', 'priority' => 'high'],
                ['title' => 'Design mockups review', 'status' => 'done', 'priority' => 'medium'],
                ['title' => 'Implementation phase 1', 'status' => 'in_progress', 'priority' => 'high'],
                ['title' => 'Testing and QA', 'status' => 'todo', 'priority' => 'medium'],
                ['title' => 'Final deployment', 'status' => 'todo', 'priority' => 'high'],
            ],
            'planning' => [
                ['title' => 'Initial research', 'status' => 'in_progress', 'priority' => 'medium'],
                ['title' => 'Budget approval', 'status' => 'todo', 'priority' => 'high'],
                ['title' => 'Vendor selection', 'status' => 'todo', 'priority' => 'low'],
            ],
            'completed' => [
                ['title' => 'Planning phase', 'status' => 'done', 'priority' => 'high'],
                ['title' => 'Execution', 'status' => 'done', 'priority' => 'high'],
                ['title' => 'Review and handover', 'status' => 'done', 'priority' => 'medium'],
            ],
        ];

        foreach ($projects as $project) {
            $templates = $taskTemplates[$project->status] ?? $taskTemplates['in_progress'];
            foreach ($templates as $t) {
                ProjectTask::create([
                    'project_id' => $project->id,
                    'employee_id' => $employees->random()->id,
                    'title' => $t['title'],
                    'description' => 'Task for '.$project->name,
                    'start_date' => Carbon::now()->subDays(rand(1, 20))->toDateString(),
                    'due_date' => Carbon::now()->addDays(rand(5, 30))->toDateString(),
                    'status' => $t['status'],
                    'priority' => $t['priority'],
                    'progress' => $t['status'] === 'done' ? 100 : ($t['status'] === 'in_progress' ? rand(20, 80) : 0),
                ]);
            }
        }
    }

    private function seedIncomeCategories(): void
    {
        $cats = ['Sales Income', 'Service Income', 'Commission', 'Interest', 'Rental Income', 'Other Income'];
        foreach ($cats as $name) {
            IncomeCategory::firstOrCreate(['name' => $name]);
        }
    }

    private function seedIncomes($branch, $admin): void
    {
        $categories = IncomeCategory::all();
        if ($categories->isEmpty()) {
            return;
        }

        $titles = ['Daily sales collection', 'Service revenue', 'Commission from supplier', 'Bank interest Q1', 'Rental income - storage', 'Miscellaneous income'];

        for ($d = 20; $d >= 0; $d -= rand(2, 5)) {
            Income::create([
                'branch_id' => $branch->id,
                'income_category_id' => $categories->random()->id,
                'user_id' => $admin->id,
                'title' => $titles[array_rand($titles)],
                'amount' => rand(5000, 50000),
                'date' => Carbon::today()->subDays($d)->toDateString(),
                'payment_method' => ['cash', 'bank_transfer', 'bkash'][rand(0, 2)],
                'notes' => 'Regular income',
            ]);
        }
    }

    private function seedInstallments($branch, $admin): void
    {
        $customers = Customer::take(5)->get();
        $sales = Sale::take(5)->get();
        if ($customers->isEmpty() || $sales->isEmpty()) {
            return;
        }

        foreach ($customers as $i => $customer) {
            $total = rand(15000, 50000);
            $downPayment = (int) ($total * 0.2);
            $numberOfInstallments = rand(3, 6);
            $monthlyAmount = (int) (($total - $downPayment) / $numberOfInstallments);

            InstallmentPlan::create([
                'branch_id' => $branch->id,
                'sale_id' => $sales->get($i % $sales->count())->id,
                'customer_id' => $customer->id,
                'user_id' => $admin->id,
                'reference_no' => 'INST-'.strtoupper(Str::random(8)),
                'total_amount' => $total,
                'down_payment' => $downPayment,
                'installment_amount' => $monthlyAmount,
                'total_installments' => $numberOfInstallments,
                'paid_installments' => 0,
                'interest_rate' => 0,
                'penalty_rate' => 0,
                'start_date' => Carbon::now()->subMonths(rand(1, 3))->toDateString(),
                'frequency' => 'monthly',
                'status' => 'active',
            ]);
        }
    }

    private function seedGiftCards($branch, $admin): void
    {
        $customers = Customer::all();
        if ($customers->isEmpty()) {
            return;
        }

        $cards = [
            ['code' => 'GC-EID2026-A1', 'current_balance' => 500, 'initial_amount' => 1000, 'status' => 'active'],
            ['code' => 'GC-EID2026-B2', 'current_balance' => 2000, 'initial_amount' => 2000, 'status' => 'active'],
            ['code' => 'GC-BDAY-C3', 'current_balance' => 0, 'initial_amount' => 500, 'status' => 'used'],
            ['code' => 'GC-PROMO-D4', 'current_balance' => 1500, 'initial_amount' => 3000, 'status' => 'active'],
            ['code' => 'GC-XMAS-E5', 'current_balance' => 750, 'initial_amount' => 750, 'status' => 'active'],
        ];

        foreach ($cards as $c) {
            GiftCard::create([
                ...$c,
                'branch_id' => $branch->id,
                'customer_id' => $customers->random()->id,
                'user_id' => $admin->id,
                'issued_date' => Carbon::now()->subDays(rand(5, 30))->toDateString(),
                'expiry_date' => Carbon::now()->addMonths(rand(3, 12))->toDateString(),
            ]);
        }
    }

    private function seedCoupons(): void
    {
        $coupons = [
            ['code' => 'EID10', 'type' => 'percent', 'value' => 10, 'min_purchase' => 500, 'usage_limit' => 100, 'used_count' => 45],
            ['code' => 'WELCOME50', 'type' => 'fixed', 'value' => 50, 'min_purchase' => 200, 'usage_limit' => 500, 'used_count' => 120],
            ['code' => 'BULK20', 'type' => 'percent', 'value' => 20, 'min_purchase' => 2000, 'usage_limit' => 50, 'used_count' => 12],
            ['code' => 'FREESHIP', 'type' => 'fixed', 'value' => 100, 'min_purchase' => 1000, 'usage_limit' => 200, 'used_count' => 80],
        ];

        foreach ($coupons as $c) {
            Coupon::create([
                ...$c,
                'start_date' => Carbon::now()->subMonth()->toDateString(),
                'end_date' => Carbon::now()->addMonths(3)->toDateString(),
                'is_active' => true,
            ]);
        }
    }

    private function seedDamageStock($branch, $admin): void
    {
        $products = Product::inRandomOrder()->limit(5)->get();
        foreach ($products as $product) {
            DamageStock::create([
                'branch_id' => $branch->id,
                'product_id' => $product->id,
                'user_id' => $admin->id,
                'reference_no' => 'DMG-'.strtoupper(Str::random(8)),
                'quantity' => rand(1, 5),
                'reason' => ['Damaged in transit', 'Expired product', 'Manufacturing defect', 'Customer return - damaged'][rand(0, 3)],
                'date' => Carbon::now()->subDays(rand(1, 14))->toDateString(),
                'notes' => 'Recorded for inventory adjustment',
            ]);
        }
    }

    private function seedDiscountPlans(): void
    {
        $plans = [
            ['name' => 'Eid Festival Discount', 'type' => 'percent', 'value' => 15, 'min_purchase' => 1000, 'max_discount' => 500, 'start_date' => Carbon::now()->subWeek()->toDateString(), 'end_date' => Carbon::now()->addWeek()->toDateString(), 'is_active' => true],
            ['name' => 'Clearance Sale', 'type' => 'fixed', 'value' => 200, 'min_purchase' => 2000, 'max_discount' => null, 'start_date' => Carbon::now()->subMonth()->toDateString(), 'end_date' => Carbon::now()->addMonth()->toDateString(), 'is_active' => true],
            ['name' => 'VIP Member Discount', 'type' => 'percent', 'value' => 10, 'min_purchase' => 500, 'max_discount' => 300, 'start_date' => Carbon::now()->toDateString(), 'end_date' => Carbon::now()->addMonths(6)->toDateString(), 'is_active' => true],
            ['name' => 'Independence Day Offer', 'type' => 'percent', 'value' => 25, 'min_purchase' => 3000, 'max_discount' => 1000, 'start_date' => '2026-03-26', 'end_date' => '2026-03-28', 'is_active' => false],
        ];

        foreach ($plans as $p) {
            DiscountPlan::create($p);
        }
    }

    private function seedCustomerGroups(): void
    {
        $groups = [
            ['name' => 'Retail Customers', 'discount_percent' => 0, 'description' => 'Regular walk-in customers', 'is_active' => true],
            ['name' => 'Wholesale Buyers', 'discount_percent' => 10, 'description' => 'Bulk purchase customers', 'is_active' => true],
            ['name' => 'VIP Members', 'discount_percent' => 5, 'description' => 'Loyal premium customers', 'is_active' => true],
            ['name' => 'Corporate Clients', 'discount_percent' => 8, 'description' => 'Business/corporate accounts', 'is_active' => true],
        ];

        foreach ($groups as $g) {
            CustomerGroup::create($g);
        }

        $groupModels = CustomerGroup::all();
        $customers = Customer::all();
        foreach ($customers as $customer) {
            $customer->update(['customer_group_id' => $groupModels->random()->id]);
        }
    }

    private function seedRewardPoints(): void
    {
        $customers = Customer::take(10)->get();
        foreach ($customers as $customer) {
            $earned = rand(100, 1500);
            $redeemed = rand(0, (int) ($earned * 0.5));
            $balance = $earned - $redeemed;

            $customer->update(['reward_points' => $balance]);

            RewardPoint::create([
                'customer_id' => $customer->id,
                'points' => $earned,
                'type' => 'earned',
                'description' => 'Purchase reward points',
            ]);

            if ($redeemed > 0) {
                RewardPoint::create([
                    'customer_id' => $customer->id,
                    'points' => -$redeemed,
                    'type' => 'redeemed',
                    'description' => 'Redeemed at checkout',
                ]);
            }
        }
    }

    private function seedJournalEntries($admin): void
    {
        $cashAccount = Account::where('account_code', '1000')->first();
        $salesAccount = Account::where('account_code', '4000')->first();

        if (! $cashAccount || ! $salesAccount) {
            return;
        }

        for ($d = 30; $d >= 0; $d -= rand(3, 7)) {
            $date = Carbon::today()->subDays($d);
            $saleAmount = rand(10000, 50000);

            $entry = JournalEntry::create([
                'date' => $date->toDateString(),
                'reference_no' => 'JE-'.strtoupper(substr(uniqid(), -8)),
                'description' => 'Daily sales revenue recording',
                'user_id' => $admin->id,
            ]);

            JournalEntryLine::create(['journal_entry_id' => $entry->id, 'account_id' => $cashAccount->id, 'debit' => $saleAmount, 'credit' => 0, 'description' => 'Cash received']);
            JournalEntryLine::create(['journal_entry_id' => $entry->id, 'account_id' => $salesAccount->id, 'debit' => 0, 'credit' => $saleAmount, 'description' => 'Sales revenue']);
        }
    }

    private function seedWhatsAppTemplates(): void
    {
        $templates = [
            ['name' => 'invoice_notification', 'category' => 'invoice', 'language' => 'en', 'body' => "Dear {{customer_name}},\n\nYour invoice #{{invoice_no}} is ready.\nTotal: ৳{{amount}}\nPaid: ৳{{paid}}\nDue: ৳{{due}}\n\nThank you for shopping with us!", 'variables' => ['customer_name', 'invoice_no', 'amount', 'paid', 'due']],
            ['name' => 'due_reminder', 'category' => 'due', 'language' => 'en', 'body' => "Dear {{customer_name}},\n\nThis is a friendly reminder that you have an outstanding balance of ৳{{amount}}.\nPlease visit us or pay via bKash/Nagad.\n\nThank you!", 'variables' => ['customer_name', 'amount']],
            ['name' => 'order_confirmation', 'category' => 'order', 'language' => 'en', 'body' => "Hi {{customer_name}}!\n\nYour order #{{order_no}} has been confirmed.\nEstimated delivery: {{delivery_date}}\n\nWe'll notify you when it's out for delivery.", 'variables' => ['customer_name', 'order_no', 'delivery_date']],
            ['name' => 'delivery_update', 'category' => 'order', 'language' => 'en', 'body' => "Hi {{customer_name}}!\n\nYour order #{{order_no}} is out for delivery.\nETA: {{eta}}\n\nPlease keep the payment ready.", 'variables' => ['customer_name', 'order_no', 'eta']],
            ['name' => 'welcome_message', 'category' => 'custom', 'language' => 'en', 'body' => "Welcome to {{business_name}}!\n\nWe're glad to have you. Browse our latest offers and enjoy shopping.\n\n📞 {{phone}}\n📍 {{address}}", 'variables' => ['business_name', 'phone', 'address']],
        ];

        foreach ($templates as $t) {
            WhatsAppTemplate::create([...$t, 'is_active' => true]);
        }
    }

    private function seedWhatsAppLogs($branch, $admin): void
    {
        $customers = Customer::take(8)->get();
        if ($customers->isEmpty()) {
            return;
        }

        $types = ['invoice', 'due_reminder', 'order_confirmation', 'custom'];
        $statuses = ['sent', 'delivered', 'read', 'sent', 'failed'];

        for ($d = 15; $d >= 0; $d -= rand(1, 3)) {
            $customer = $customers->random();
            WhatsAppLog::create([
                'user_id' => $admin->id,
                'branch_id' => $branch->id,
                'recipient_phone' => $customer->phone ?? '+8801700000000',
                'recipient_name' => $customer->name,
                'message' => "Dear {$customer->name}, thank you for your purchase!",
                'type' => $types[array_rand($types)],
                'status' => $statuses[array_rand($statuses)],
                'external_id' => 'WA-'.strtoupper(substr(uniqid(), -10)),
            ]);
        }
    }
}
