<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScrumTeam extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    protected $priimaryKey = 'id'; 
    protected $table = 'SCRUM_Team';
    public $timestamps = false;
    public function meetings(){
        return $this->hasMany(Meeting::class);
    }
}

