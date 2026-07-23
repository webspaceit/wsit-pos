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
 * @property int $user_id
 * @property string $reference_no
 * @property string $date
 * @property string $status
 * @property string|null $notes
 */
class StockCount extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'user_id', 'reference_no', 'date', 'status', 'notes'];

    protected $casts = ['date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (StockCount $count) {
            if (empty($count->reference_no)) {
                $count->reference_no = 'SC-'.strtoupper(Str::random(8));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockCountItem::class);
    }

    public function scopeByBranch($query, ?int $branchId)
    {
        return $branchId ? $query->where('branch_id', $branchId) : $query;
    }
}
