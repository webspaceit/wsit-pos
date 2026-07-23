<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $branch_id
 * @property int $product_id
 * @property int $user_id
 * @property string $reference_no
 * @property float $quantity
 * @property float $unit_cost
 * @property float $total_loss
 * @property string $date
 * @property string|null $reason
 * @property string|null $notes
 */
class DamageStock extends Model
{
    use HasFactory;

    protected $table = 'damage_stock';

    protected $fillable = [
        'branch_id', 'product_id', 'user_id', 'reference_no',
        'quantity', 'unit_cost', 'total_loss', 'date', 'reason', 'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_loss' => 'decimal:2',
        'date' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (DamageStock $damage) {
            if (empty($damage->reference_no)) {
                $damage->reference_no = 'DMG-'.strtoupper(Str::random(8));
            }
            $product = Product::find($damage->product_id);
            if ($product) {
                $damage->unit_cost = $product->purchase_price;
                $damage->total_loss = $damage->quantity * $damage->unit_cost;
            }
        });

        static::created(function (DamageStock $damage) {
            Product::where('id', $damage->product_id)->decrement('stock_quantity', $damage->quantity);
        });

        static::deleted(function (DamageStock $damage) {
            Product::where('id', $damage->product_id)->increment('stock_quantity', $damage->quantity);
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByBranch($query, ?int $branchId)
    {
        return $branchId ? $query->where('branch_id', $branchId) : $query;
    }

    public function scopeByDateRange($query, ?string $from, ?string $to)
    {
        if ($from) {
            $query->where('date', '>=', $from);
        }
        if ($to) {
            $query->where('date', '<=', $to);
        }

        return $query;
    }
}
