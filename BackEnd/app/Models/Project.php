<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'githubRepo', 'owner'];
    protected $primaryKey = 'id';
    protected $table = 'project';
    public $timestamps = false;
}
