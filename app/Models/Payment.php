<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property string $payable_type
 * @property int $payable_id
 * @property float $amount
 * @property string $payment_method
 * @property string|null $reference_no
 * @property string $date
 * @property string|null $notes
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['payable_type', 'payable_id', 'amount', 'payment_method', 'reference_no', 'date', 'notes'];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
    ];

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }
}
