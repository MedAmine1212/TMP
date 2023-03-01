<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workson extends Model
{
    use HasFactory;
    protected $table = 'works_on';
    protected $primaryKey = 'id';
    protected $fillable = ['id','idProject','idSCRUMTeam','status','startDate','endDate'];
    public $timestamps = false;
}
