<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $from_branch_id
 * @property int $to_branch_id
 * @property int $user_id
 * @property string $reference_no
 * @property string $date
 * @property string $status
 * @property string|null $notes
 */
class StockTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_branch_id', 'to_branch_id', 'user_id', 'reference_no', 'date', 'status', 'notes',
    ];

    protected $casts = ['date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (StockTransfer $transfer) {
            if (empty($transfer->reference_no)) {
                $transfer->reference_no = 'ST-'.strtoupper(Str::random(8));
            }
        });
    }

    public function fromBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
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
