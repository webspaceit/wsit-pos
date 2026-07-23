<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstallmentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'installment_plan_id', 'user_id', 'installment_number', 'amount', 'penalty',
        'running_balance', 'due_date', 'paid_date', 'status', 'payment_method', 'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'penalty' => 'decimal:2',
        'running_balance' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date',
    ];

    public function installmentPlan(): BelongsTo
    {
        return $this->belongsTo(InstallmentPlan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
