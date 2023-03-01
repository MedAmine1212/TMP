<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JoinTeam extends Model
{
    use HasFactory;
    protected $fillable = ['idCollaborator','role', 'idSCRUMTeam'];
    protected $primaryKey = 'id';
    protected $table = 'join_team';
    public $timestamps = false;
}

