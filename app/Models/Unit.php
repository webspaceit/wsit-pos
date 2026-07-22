<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $short_name
 */
class Unit extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'short_name'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
