<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class label extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'description', 'color'];
    protected $primaryKey = 'id';
    protected $table = 'labels';
    public $timestamps = false;

}
