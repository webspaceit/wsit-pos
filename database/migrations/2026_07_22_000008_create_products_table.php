<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('sku', 50)->unique()->default('');
            $table->string('barcode', 50)->nullable()->unique();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->enum('tax_type', ['inclusive', 'exclusive'])->default('exclusive');
            $table->decimal('stock_quantity', 15, 2)->default(0);
            $table->decimal('min_stock', 15, 2)->default(0);
            $table->decimal('max_stock', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('image', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
