<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\Admin\LandingPageSettingsController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChallanController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DamageStockController;
use App\Http\Controllers\DueCollectionController;
use App\Http\Controllers\ExchangeController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GiftCardController;
use App\Http\Controllers\IncomeCategoryController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\PackingSlipController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleReturnController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockCountController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
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
    Route::get('settings/landing-page', [LandingPageSettingsController::class, 'index'])->name('admin.landing-page');
    Route::put('settings/landing-page', [LandingPageSettingsController::class, 'update'])->name('admin.landing-page.update');

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
});
