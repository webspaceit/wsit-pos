<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionOrder extends Model
{
    protected $fillable = [
        'recipe_id', 'branch_id', 'user_id', 'reference_no', 'date',
        'quantity_to_produce', 'quantity_produced', 'total_cost', 'status', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity_to_produce' => 'decimal:2',
        'quantity_produced' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getProgressPercentAttribute(): int
    {
        if ($this->quantity_to_produce <= 0) {
            return 0;
        }

        return (int) min(100, ($this->quantity_produced / $this->quantity_to_produce) * 100);
    }
}
