<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address
 * @property string|null $city
 * @property string|null $tax_id
 * @property float $balance
 * @property float $credit_limit
 * @property string|null $notes
 * @property bool $is_active
 */
class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'email', 'address', 'city', 'tax_id', 'balance', 'credit_limit', 'notes', 'is_active'];

    protected $casts = [
        'balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
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
