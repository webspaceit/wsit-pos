<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string $sku
 * @property string|null $barcode
 * @property int|null $category_id
 * @property int|null $unit_id
 * @property float $purchase_price
 * @property float $selling_price
 * @property float $tax_rate
 * @property string $tax_type
 * @property float $stock_quantity
 * @property float $min_stock
 * @property float $max_stock
 * @property string|null $description
 * @property string|null $image
 * @property bool $is_active
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'sku', 'barcode', 'category_id', 'unit_id',
        'purchase_price', 'selling_price', 'tax_rate', 'tax_type',
        'stock_quantity', 'min_stock', 'max_stock', 'description', 'image', 'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'stock_quantity' => 'decimal:2',
        'min_stock' => 'decimal:2',
        'max_stock' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->sku)) {
                $product->sku = 'SKU-'.strtoupper(Str::random(8));
            }
            if (empty($product->barcode)) {
                $product->barcode = (string) rand(1000000000000, 9999999999999);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class)->withPivot('stock_quantity');
    }

    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function isLowStock(): bool
    {
        return $this->min_stock > 0 && $this->stock_quantity <= $this->min_stock;
    }

    public function getProfitAttribute(): float
    {
        return $this->selling_price - $this->purchase_price;
    }

    public function getProfitMarginAttribute(): float
    {
        return $this->purchase_price > 0
            ? (($this->selling_price - $this->purchase_price) / $this->purchase_price) * 100
            : 0;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock_quantity', '<=', 'min_stock')
            ->where('min_stock', '>', 0);
    }

    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        return $query;
    }
}
