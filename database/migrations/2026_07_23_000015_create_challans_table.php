<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('sale_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->string('reference_no', 50);
            $table->string('invoice_no', 50);
            $table->date('date');
            $table->string('delivery_address')->nullable();
            $table->string('driver_name', 100)->nullable();
            $table->string('vehicle_no', 50)->nullable();
            $table->enum('status', ['pending', 'dispatched', 'delivered', 'returned'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('challan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->decimal('quantity', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challan_items');
        Schema::dropIfExists('challans');
    }
};
