<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'discount_percent', 'description', 'is_active',
    ];

    protected $casts = [
        'discount_percent' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
