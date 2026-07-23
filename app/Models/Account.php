<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_code', 'name', 'type', 'sub_type', 'parent_id', 'description', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function journalLines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class, 'account_id');
    }

    public function getBalanceAttribute(): float
    {
        $debits = $this->journalLines()
            ->whereHas('journalEntry', fn ($q) => $q->where('is_posted', true))
            ->sum('debit');

        $credits = $this->journalLines()
            ->whereHas('journalEntry', fn ($q) => $q->where('is_posted', true))
            ->sum('credit');

        return match ($this->type) {
            'asset', 'expense' => (float) $debits - (float) $credits,
            default => (float) $credits - (float) $debits,
        };
    }

    public function getFormattedCodeAttribute(): string
    {
        return $this->account_code.' - '.$this->name;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
