<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $fillable = [
        'product_id', 'name', 'yield_quantity', 'notes', 'is_active',
    ];

    protected $casts = [
        'yield_quantity' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(RecipeItem::class);
    }

    public function productionOrders(): HasMany
    {
        return $this->hasMany(ProductionOrder::class);
    }

    public function getTotalCostAttribute(): float
    {
        return $this->items->sum(fn (RecipeItem $item) => $item->quantity * $item->unit_cost);
    }
}
