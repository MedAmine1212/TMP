<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;
    protected $fillable = ['idSCRUMTeam','title', 'date'];
    protected $primaryKey = 'id';
    protected $table = 'meetings';
    public $timestamps = false;
    public function ScrumTeam(){
        return $this->belongsTo(ScrumTeam::class);
    }
}
