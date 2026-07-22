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
 * @property int|null $supplier_id
 * @property int $user_id
 * @property string $reference_no
 * @property string $date
 * @property float $total
 * @property float $discount
 * @property float $tax_amount
 * @property float $shipping_cost
 * @property float $grand_total
 * @property float $paid_amount
 * @property float $due_amount
 * @property string $status
 * @property string|null $notes
 */
class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'supplier_id', 'user_id', 'reference_no', 'date',
        'total', 'discount', 'tax_amount', 'shipping_cost', 'grand_total',
        'paid_amount', 'due_amount', 'status', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'total' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Purchase $purchase) {
            if (empty($purchase->reference_no)) {
                $purchase->reference_no = 'PUR-'.strtoupper(Str::random(8));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
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
        return $this->hasMany(PurchaseItem::class);
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

    public function scopeStatus($query, ?string $status)
    {
        return $status ? $query->where('status', $status) : $query;
    }
}
