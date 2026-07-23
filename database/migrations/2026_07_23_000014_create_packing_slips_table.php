<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packing_slips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('sale_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('reference_no', 50);
            $table->date('date');
            $table->enum('status', ['pending', 'packed', 'shipped', 'delivered'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('packing_slip_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('packing_slip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->decimal('quantity', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packing_slip_items');
        Schema::dropIfExists('packing_slips');
    }
};
