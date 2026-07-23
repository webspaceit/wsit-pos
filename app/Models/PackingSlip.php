<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PackingSlip extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'sale_id', 'user_id', 'reference_no', 'date', 'status', 'notes'];

    protected $casts = ['date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (PackingSlip $slip) {
            if (empty($slip->reference_no)) {
                $slip->reference_no = 'PS-'.strtoupper(Str::random(8));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PackingSlipItem::class);
    }
}
