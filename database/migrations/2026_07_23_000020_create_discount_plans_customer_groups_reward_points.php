<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->enum('type', ['fixed', 'percent']);
            $table->decimal('value', 15, 2);
            $table->decimal('min_purchase', 15, 2)->default(0);
            $table->decimal('max_discount', 15, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('customer_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('reward_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('sale_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('points');
            $table->enum('type', ['earned', 'redeemed', 'adjusted']);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('customer_group_id')->nullable()->constrained()->nullOnDelete()->after('id');
            $table->integer('reward_points')->default(0)->after('credit_limit');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['customer_group_id']);
            $table->dropColumn(['customer_group_id', 'reward_points']);
        });
        Schema::dropIfExists('reward_points');
        Schema::dropIfExists('customer_groups');
        Schema::dropIfExists('discount_plans');
    }
};
