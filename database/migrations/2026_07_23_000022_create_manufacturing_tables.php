<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained();
            $table->string('name', 100);
            $table->decimal('yield_quantity', 15, 2)->default(1);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('recipe_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('reference_no', 50)->unique();
            $table->date('date');
            $table->decimal('quantity_to_produce', 15, 2);
            $table->decimal('quantity_produced', 15, 2)->default(0);
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_orders');
        Schema::dropIfExists('recipe_items');
        Schema::dropIfExists('recipes');
    }
};
