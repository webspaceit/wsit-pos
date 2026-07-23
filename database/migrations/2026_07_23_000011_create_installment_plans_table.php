<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('sale_id')->constrained();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('reference_no', 50);
            $table->decimal('total_amount', 15, 2);
            $table->decimal('down_payment', 15, 2)->default(0);
            $table->decimal('installment_amount', 15, 2);
            $table->integer('total_installments');
            $table->integer('paid_installments')->default(0);
            $table->decimal('interest_rate', 5, 2)->default(0);
            $table->decimal('penalty_rate', 5, 2)->default(0);
            $table->date('start_date');
            $table->enum('frequency', ['weekly', 'biweekly', 'monthly'])->default('monthly');
            $table->enum('status', ['active', 'completed', 'defaulted', 'cancelled'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('installment_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('installment_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->integer('installment_number');
            $table->decimal('amount', 15, 2);
            $table->decimal('penalty', 15, 2)->default(0);
            $table->decimal('running_balance', 15, 2);
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->enum('payment_method', ['cash', 'card', 'bkash', 'nagad', 'rocket', 'bank_transfer', 'cheque', 'other'])->default('cash');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installment_payments');
        Schema::dropIfExists('installment_plans');
    }
};
