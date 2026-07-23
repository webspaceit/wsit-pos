<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $stock_count_id
 * @property int $product_id
 * @property float $system_quantity
 * @property float $counted_quantity
 * @property float $difference
 */
class StockCountItem extends Model
{
    use HasFactory;

    protected $fillable = ['stock_count_id', 'product_id', 'system_quantity', 'counted_quantity', 'difference'];

    protected $casts = [
        'system_quantity' => 'decimal:2',
        'counted_quantity' => 'decimal:2',
        'difference' => 'decimal:2',
    ];

    public function stockCount(): BelongsTo
    {
        return $this->belongsTo(StockCount::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
