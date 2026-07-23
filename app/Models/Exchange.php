<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Exchange extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'sale_id', 'customer_id', 'user_id', 'reference_no',
        'date', 'price_difference', 'payment_method', 'reason', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'price_difference' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Exchange $exchange) {
            if (empty($exchange->reference_no)) {
                $exchange->reference_no = 'EX-'.strtoupper(Str::random(8));
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

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ExchangeItem::class);
    }
}
