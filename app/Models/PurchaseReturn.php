<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $branch_id
 * @property int $purchase_id
 * @property int|null $supplier_id
 * @property int $user_id
 * @property string $reference_no
 * @property string $date
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $grand_total
 * @property string $payment_method
 * @property string $status
 * @property string|null $reason
 * @property string|null $notes
 */
class PurchaseReturn extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'purchase_id', 'supplier_id', 'user_id', 'reference_no', 'date',
        'subtotal', 'tax_amount', 'grand_total', 'payment_method', 'status', 'reason', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (PurchaseReturn $return) {
            if (empty($return->reference_no)) {
                $return->reference_no = 'PR-'.strtoupper(Str::random(8));
            }
        });

        static::created(function (PurchaseReturn $return) {
            foreach ($return->items as $item) {
                $product = $item->product;
                $product->decrement('stock_quantity', $item->quantity);
            }
        });

        static::deleted(function (PurchaseReturn $return) {
            foreach ($return->items as $item) {
                $product = $item->product;
                $product->increment('stock_quantity', $item->quantity);
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseReturnItem::class);
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
