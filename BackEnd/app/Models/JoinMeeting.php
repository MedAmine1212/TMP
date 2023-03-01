<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JoinMeeting extends Model
{
    use HasFactory;
    protected $fillable = ['idCollaborator'];
    protected $primaryKey = 'id';
    protected $table = 'join_meetings';
    public $timestamps = false;
}

