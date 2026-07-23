<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('phone', 30)->nullable();
            $table->string('position', 100);
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('salary', 15, 2)->default(0);
            $table->date('join_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['active', 'inactive', 'terminated'])->default('active');
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained();
            $table->date('date');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->enum('status', ['present', 'absent', 'late', 'half_day', 'holiday'])->default('present');
            $table->decimal('hours_worked', 5, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'date']);
        });

        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained();
            $table->string('month', 7); // YYYY-MM
            $table->decimal('base_salary', 15, 2);
            $table->decimal('bonus', 15, 2)->default(0);
            $table->decimal('deductions', 15, 2)->default(0);
            $table->decimal('net_salary', 15, 2);
            $table->enum('status', ['pending', 'paid', 'partial'])->default('pending');
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->date('paid_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salaries');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('employees');
    }
};
