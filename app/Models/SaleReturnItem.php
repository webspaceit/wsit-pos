<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $sale_return_id
 * @property int $product_id
 * @property float $quantity
 * @property float $unit_price
 * @property float $tax_amount
 * @property float $total
 */
class SaleReturnItem extends Model
{
    use HasFactory;

    protected $fillable = ['sale_return_id', 'product_id', 'quantity', 'unit_price', 'tax_amount', 'total'];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function saleReturn(): BelongsTo
    {
        return $this->belongsTo(SaleReturn::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
