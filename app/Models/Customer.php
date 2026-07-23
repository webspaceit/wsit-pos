<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $customer_group_id
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address
 * @property string|null $city
 * @property string|null $tax_id
 * @property float $balance
 * @property float $credit_limit
 * @property int $reward_points
 * @property string|null $notes
 * @property bool $is_active
 */
class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'email', 'address', 'city', 'tax_id', 'balance', 'credit_limit', 'customer_group_id', 'reward_points', 'notes', 'is_active'];

    protected $casts = [
        'balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'reward_points' => 'integer',
        'is_active' => 'boolean',
    ];

    public function customerGroup(): BelongsTo
    {
        return $this->belongsTo(CustomerGroup::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function rewardPoints(): HasMany
    {
        return $this->hasMany(RewardPoint::class);
    }

    public function getDueAmountAttribute(): float
    {
        return (float) $this->sales()->sum('due_amount');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
