<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;
    protected $fillable = ['category', 'title', 'project', 'description'];
    protected $priimaryKey = 'id';
    protected $table = 'document';
    public $timestamps = false;
}
