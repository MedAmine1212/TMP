<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FunctionalRequirement extends Model
{
    use HasFactory;
    protected $fillable = ['version', 'number', 'title', 'description', 'author', 'parentId', 'original', 'responsible','elapsedTime','estimationTime', 'status', 'functional_requirements'];
    protected $primaryKey = 'id';
    protected $table = 'functional_requirement';
    public $timestamps = false;

    public function FunctionalRequirement(): BelongsTo
    {
        return $this->belongsTo('App\Models\FunctionalRequirement', 'id');
    }



    public function author(): BelongsTo
    {
        return $this->belongsTo('App\Models\Collaborator', 'id');
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo('App\Models\Collaborator', 'id');
    }

    public function FunctionalRequirements(): HasMany
    {
        return $this->hasMany('App\Models\FunctionalRequirement', 'id');
    }
}
