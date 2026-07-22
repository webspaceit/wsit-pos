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
 * @property string|null $company
 * @property string|null $tax_id
 * @property float $balance
 * @property string|null $notes
 * @property bool $is_active
 */
class Supplier extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'email', 'address', 'city', 'company', 'tax_id', 'balance', 'notes', 'is_active'];

    protected $casts = [
        'balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
