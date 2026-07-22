<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DueCollectionController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StockAdjustmentController;
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

    // Units
    Route::resource('units', UnitController::class)->except(['show', 'edit', 'create']);

    // Suppliers
    Route::resource('suppliers', SupplierController::class)->except(['edit', 'create']);

    // Customers
    Route::resource('customers', CustomerController::class)->except(['edit', 'create']);

    // Purchases
    Route::resource('purchases', PurchaseController::class)->except(['edit', 'update']);
    Route::patch('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');

    // Sales
    Route::resource('sales', SaleController::class)->except(['edit', 'update']);
    Route::patch('sales/{sale}/void', [SaleController::class, 'voidSale'])->name('sales.void');

    // Expenses
    Route::resource('expenses', ExpenseController::class)->except(['show', 'edit', 'create']);
    Route::resource('expense-categories', ExpenseCategoryController::class)->except(['show', 'edit', 'create']);

    // Due Collections
    Route::get('due-collections', [DueCollectionController::class, 'index'])->name('due-collections.index');
    Route::post('due-collections', [DueCollectionController::class, 'store'])->name('due-collections.store');

    // Stock Management
    Route::get('stock', [StockAdjustmentController::class, 'index'])->name('stock.index');
    Route::post('stock/adjust', [StockAdjustmentController::class, 'adjust'])->name('stock.adjust');

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
    });

    // Business Settings
    Route::get('settings/business', [SettingController::class, 'index'])->name('settings.business');
    Route::put('settings/business', [SettingController::class, 'update'])->name('settings.business.update');
});
