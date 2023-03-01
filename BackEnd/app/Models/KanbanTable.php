<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class KanbanTable extends Model
{
    
    use HasFactory;
    protected $fillable = ['name'];
    protected $primaryKey = 'id';
    protected $table = 'kanban_table';
    public $timestamps = false;
}