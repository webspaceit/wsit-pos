<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('income_category_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('title', 150);
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->enum('payment_method', ['cash', 'card', 'bkash', 'nagad', 'rocket', 'bank_transfer', 'cheque', 'other'])->default('cash');
            $table->string('reference_no', 50)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
