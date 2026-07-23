<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\Admin\LandingPageSettingsController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\BrandingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChallanController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerGroupController;
use App\Http\Controllers\DamageStockController;
use App\Http\Controllers\DiscountPlanController;
use App\Http\Controllers\DueCollectionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ExchangeController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GiftCardController;
use App\Http\Controllers\IncomeCategoryController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\PackingSlipController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\PosSettingsController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionOrderController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\RepairController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RewardPointController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleReturnController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockCountController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WhatsAppController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // POS Terminal
    Route::get('pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');
    Route::get('pos/invoice/{sale}', [PosController::class, 'invoice'])->name('pos.invoice');
    Route::get('pos/products/search', [ProductController::class, 'search'])->name('pos.products.search');

    // Products
    Route::resource('products', ProductController::class);

    // Categories
    Route::resource('categories', CategoryController::class)->except(['show', 'edit', 'create']);

    // Brands
    Route::resource('brands', BrandController::class)->except(['show', 'edit', 'create']);

    // Units
    Route::resource('units', UnitController::class)->except(['show', 'edit', 'create']);

    // Suppliers
    Route::resource('suppliers', SupplierController::class)->except(['edit', 'create']);

    // Customers
    Route::resource('customers', CustomerController::class)->except(['edit', 'create']);

    // Purchases
    Route::resource('purchases', PurchaseController::class)->except(['edit', 'update']);
    Route::patch('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');

    // Purchase Returns
    Route::resource('purchase-returns', PurchaseReturnController::class)->except(['edit', 'update']);

    // Sales
    Route::resource('sales', SaleController::class)->except(['edit', 'update']);
    Route::patch('sales/{sale}/void', [SaleController::class, 'voidSale'])->name('sales.void');

    // Sale Returns
    Route::resource('sale-returns', SaleReturnController::class)->except(['edit', 'update']);

    // Expenses
    Route::resource('expenses', ExpenseController::class)->except(['show', 'edit', 'create']);
    Route::resource('expense-categories', ExpenseCategoryController::class)->except(['show', 'edit', 'create']);

    // Income
    Route::resource('incomes', IncomeController::class)->except(['show', 'edit', 'create']);
    Route::resource('income-categories', IncomeCategoryController::class)->except(['show', 'edit', 'create']);

    // Due Collections
    Route::get('due-collections', [DueCollectionController::class, 'index'])->name('due-collections.index');
    Route::post('due-collections', [DueCollectionController::class, 'store'])->name('due-collections.store');

    // Stock Management
    Route::get('stock', [StockAdjustmentController::class, 'index'])->name('stock.index');
    Route::post('stock/adjust', [StockAdjustmentController::class, 'adjust'])->name('stock.adjust');

    // Stock Transfers
    Route::resource('stock-transfers', StockTransferController::class)->except(['edit', 'update']);
    Route::patch('stock-transfers/{stockTransfer}/receive', [StockTransferController::class, 'receive'])->name('stock-transfers.receive');

    // Stock Counts
    Route::resource('stock-counts', StockCountController::class)->except(['edit', 'update']);

    // Damage Stock
    Route::resource('damage-stock', DamageStockController::class)->except(['show', 'edit', 'create']);

    // Branches
    Route::resource('branches', BranchController::class)->except(['show', 'edit', 'create']);

    // Users
    Route::resource('users', UserController::class)->except(['show', 'edit', 'create']);

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('sales', [ReportController::class, 'sales'])->name('sales');
        Route::get('purchases', [ReportController::class, 'purchases'])->name('purchases');
        Route::get('profit-loss', [ReportController::class, 'profitLoss'])->name('profit-loss');
        Route::get('stock', [ReportController::class, 'stock'])->name('stock');
        Route::get('tax', [ReportController::class, 'tax'])->name('tax');
        Route::get('customers', [ReportController::class, 'customers'])->name('customers');
        Route::get('best-sellers', [ReportController::class, 'bestSellers'])->name('best-sellers');
        Route::get('product', [ReportController::class, 'productReport'])->name('product');
        Route::get('daily-sales', [ReportController::class, 'dailySales'])->name('daily-sales');
        Route::get('monthly-sales', [ReportController::class, 'monthlySales'])->name('monthly-sales');
        Route::get('daily-purchases', [ReportController::class, 'dailyPurchases'])->name('daily-purchases');
        Route::get('monthly-purchases', [ReportController::class, 'monthlyPurchases'])->name('monthly-purchases');
        Route::get('payments', [ReportController::class, 'payments'])->name('payments');
        Route::get('supplier-dues', [ReportController::class, 'supplierDues'])->name('supplier-dues');
        Route::get('cash-register', [ReportController::class, 'cashRegister'])->name('cash-register');
        Route::get('activity-log', [ReportController::class, 'activityLog'])->name('activity-log');
    });

    // Business Settings
    Route::get('settings/business', [SettingController::class, 'index'])->name('settings.business');
    Route::put('settings/business', [SettingController::class, 'update'])->name('settings.business.update');

    // Landing Page Settings
    Route::get('landing-page', [LandingPageSettingsController::class, 'index'])->name('admin.landing-page');
    Route::put('landing-page', [LandingPageSettingsController::class, 'update'])->name('admin.landing-page.update');

    // Discount Plans
    Route::resource('discount-plans', DiscountPlanController::class)->except(['show', 'edit', 'create']);

    // Customer Groups
    Route::resource('customer-groups', CustomerGroupController::class)->except(['show', 'edit', 'create']);

    // Reward Points
    Route::resource('reward-points', RewardPointController::class)->except(['show', 'edit', 'create']);

    // POS Settings (Barcode, Invoice, POS, Mail, SMS)
    Route::get('pos-settings', [PosSettingsController::class, 'index'])->name('settings.pos-settings.index');
    Route::post('pos-settings', [PosSettingsController::class, 'update'])->name('settings.pos-settings.update');

    // Branding (Logo & Favicon)
    Route::get('branding', [BrandingController::class, 'index'])->name('branding.index');
    Route::post('branding/logo', [BrandingController::class, 'updateLogo'])->name('branding.logo.update');
    Route::post('branding/favicon', [BrandingController::class, 'updateFavicon'])->name('branding.favicon.update');
    Route::delete('branding/logo', [BrandingController::class, 'destroyLogo'])->name('branding.logo.destroy');
    Route::delete('branding/favicon', [BrandingController::class, 'destroyFavicon'])->name('branding.favicon.destroy');

    // Quotations
    Route::resource('quotations', QuotationController::class)->except(['edit', 'update']);

    // Installments
    Route::resource('installments', InstallmentController::class)->except(['edit', 'update']);
    Route::post('installments/{payment}/pay', [InstallmentController::class, 'pay'])->name('installments.pay');

    // Gift Cards
    Route::resource('gift-cards', GiftCardController::class)->except(['edit', 'create']);

    // Coupons
    Route::resource('coupons', CouponController::class)->except(['show', 'edit', 'create']);

    // Packing Slips
    Route::resource('packing-slips', PackingSlipController::class)->except(['edit', 'update']);

    // Challans
    Route::resource('challans', ChallanController::class)->except(['edit', 'update']);

    // Exchanges
    Route::resource('exchanges', ExchangeController::class)->except(['edit', 'update']);

    // Accounting
    Route::resource('accounting/accounts', AccountController::class)->except(['show', 'edit', 'create']);
    Route::get('accounting/trial-balance', [AccountingController::class, 'trialBalance'])->name('accounting.trial-balance');
    Route::get('accounting/general-ledger', [AccountingController::class, 'generalLedger'])->name('accounting.general-ledger');
    Route::get('accounting/balance-sheet', [AccountingController::class, 'balanceSheet'])->name('accounting.balance-sheet');
    Route::get('accounting/cash-flow', [AccountingController::class, 'cashFlow'])->name('accounting.cash-flow');

    // HRM
    Route::get('hrm/employees', [EmployeeController::class, 'index'])->name('hrm.employees.index');
    Route::post('hrm/employees', [EmployeeController::class, 'store'])->name('hrm.employees.store');
    Route::get('hrm/employees/{employee}', [EmployeeController::class, 'show'])->name('hrm.employees.show');
    Route::put('hrm/employees/{employee}', [EmployeeController::class, 'update'])->name('hrm.employees.update');
    Route::delete('hrm/employees/{employee}', [EmployeeController::class, 'destroy'])->name('hrm.employees.destroy');
    Route::get('hrm/attendance', [EmployeeController::class, 'attendance'])->name('hrm.attendance.index');
    Route::post('hrm/attendance', [EmployeeController::class, 'attendanceStore'])->name('hrm.attendance.store');
    Route::get('hrm/salary', [EmployeeController::class, 'salary'])->name('hrm.salary.index');
    Route::post('hrm/salary/generate', [EmployeeController::class, 'salaryGenerate'])->name('hrm.salary.generate');
    Route::post('hrm/salary/{salary}/pay', [EmployeeController::class, 'salaryPay'])->name('hrm.salary.pay');

    // Manufacturing
    Route::resource('manufacturing/recipes', RecipeController::class)->except(['show', 'edit', 'create']);
    Route::get('manufacturing/orders', [ProductionOrderController::class, 'index'])->name('manufacturing.orders.index');
    Route::post('manufacturing/orders', [ProductionOrderController::class, 'store'])->name('manufacturing.orders.store');
    Route::put('manufacturing/orders/{order}/status', [ProductionOrderController::class, 'updateStatus'])->name('manufacturing.orders.update-status');
    Route::delete('manufacturing/orders/{order}', [ProductionOrderController::class, 'destroy'])->name('manufacturing.orders.destroy');

    // Repairs
    Route::get('repairs', [RepairController::class, 'index'])->name('repairs.index');
    Route::post('repairs', [RepairController::class, 'store'])->name('repairs.store');
    Route::get('repairs/{ticket}', [RepairController::class, 'show'])->name('repairs.show');
    Route::put('repairs/{ticket}', [RepairController::class, 'update'])->name('repairs.update');
    Route::delete('repairs/{ticket}', [RepairController::class, 'destroy'])->name('repairs.destroy');

    // Projects
    Route::resource('projects', ProjectController::class)->except(['edit', 'create']);
    Route::post('projects/{project}/tasks', [ProjectController::class, 'storeTask'])->name('projects.tasks.store');
    Route::put('projects/tasks/{task}', [ProjectController::class, 'updateTask'])->name('projects.tasks.update');
    Route::delete('projects/tasks/{task}', [ProjectController::class, 'destroyTask'])->name('projects.tasks.destroy');

    // WhatsApp Integration
    Route::get('whatsapp', [WhatsAppController::class, 'index'])->name('whatsapp.index');
    Route::post('whatsapp/send', [WhatsAppController::class, 'send'])->name('whatsapp.send');
    Route::post('whatsapp/send-invoice', [WhatsAppController::class, 'sendInvoice'])->name('whatsapp.send-invoice');
    Route::get('whatsapp/settings', [WhatsAppController::class, 'settings'])->name('whatsapp.settings');
    Route::post('whatsapp/settings', [WhatsAppController::class, 'settingsUpdate'])->name('whatsapp.settings.update');
    Route::get('whatsapp/templates', [WhatsAppController::class, 'templates'])->name('whatsapp.templates.index');
    Route::post('whatsapp/templates', [WhatsAppController::class, 'templateStore'])->name('whatsapp.templates.store');
    Route::put('whatsapp/templates/{template}', [WhatsAppController::class, 'templateUpdate'])->name('whatsapp.templates.update');
    Route::delete('whatsapp/templates/{template}', [WhatsAppController::class, 'templateDestroy'])->name('whatsapp.templates.destroy');

    // AI Assistant
    Route::get('ai-assistant', [AiAssistantController::class, 'index'])->name('ai-assistant.index');
    Route::post('ai-assistant/query', [AiAssistantController::class, 'query'])->name('ai-assistant.query');
});
