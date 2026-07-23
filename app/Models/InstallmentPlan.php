<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class InstallmentPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'sale_id', 'customer_id', 'user_id', 'reference_no',
        'total_amount', 'down_payment', 'installment_amount', 'total_installments',
        'paid_installments', 'interest_rate', 'penalty_rate', 'start_date',
        'frequency', 'status', 'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'down_payment' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'penalty_rate' => 'decimal:2',
        'start_date' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (InstallmentPlan $plan) {
            if (empty($plan->reference_no)) {
                $plan->reference_no = 'INST-'.strtoupper(Str::random(8));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(InstallmentPayment::class);
    }

    public function scopeByBranch($query, ?int $branchId)
    {
        return $branchId ? $query->where('branch_id', $branchId) : $query;
    }
}
