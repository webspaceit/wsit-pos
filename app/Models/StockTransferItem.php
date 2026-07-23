<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $stock_transfer_id
 * @property int $product_id
 * @property float $quantity
 */
class StockTransferItem extends Model
{
    use HasFactory;

    protected $fillable = ['stock_transfer_id', 'product_id', 'quantity'];

    protected $casts = ['quantity' => 'decimal:2'];

    public function stockTransfer(): BelongsTo
    {
        return $this->belongsTo(StockTransfer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
