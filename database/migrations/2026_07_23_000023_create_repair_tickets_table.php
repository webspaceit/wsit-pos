<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained();
            $table->string('ticket_no', 50)->unique();
            $table->date('date');
            $table->string('device_type', 100);
            $table->string('device_brand', 100)->nullable();
            $table->string('device_model', 100)->nullable();
            $table->string('serial_number', 100)->nullable();
            $table->text('issue_description');
            $table->decimal('estimated_cost', 15, 2)->default(0);
            $table->decimal('actual_cost', 15, 2)->default(0);
            $table->decimal('advance_paid', 15, 2)->default(0);
            $table->enum('status', ['received', 'diagnosed', 'in_repair', 'ready', 'delivered', 'cancelled'])->default('received');
            $table->date('estimated_delivery')->nullable();
            $table->date('actual_delivery')->nullable();
            $table->text('technician_notes')->nullable();
            $table->text('internal_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_tickets');
    }
};
