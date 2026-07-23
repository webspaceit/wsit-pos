<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'value', 'min_purchase', 'max_discount', 'start_date', 'end_date', 'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function isValid(float $purchaseTotal = 0): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->start_date && $this->start_date->isFuture()) {
            return false;
        }

        if ($this->end_date && $this->end_date->isPast()) {
            return false;
        }

        if ($purchaseTotal < $this->min_purchase) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        $discount = $this->type === 'percent' ? ($amount * $this->value / 100) : $this->value;

        if ($this->max_discount && $discount > $this->max_discount) {
            $discount = (float) $this->max_discount;
        }

        return round($discount, 2);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
