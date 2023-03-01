<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Version extends Model
{
    use HasFactory;
    protected $fillable = ['number', 'startDate', 'endDate', 'project', 'functional_requirements'];
    protected $primaryKey = 'id';
    protected $table = 'version';
    public $timestamps = false;

    public function project(): BelongsTo
    {
        return $this->belongsTo('App\Models\Project', 'id');
    }

    public function FunctionalRequirements(): HasMany
    {
        return $this->hasMany('App\Models\FunctionalRequirement', 'id');
    }
}
