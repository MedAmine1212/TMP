<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class KanbanColumn extends Model
{
    
    use HasFactory;
    protected $fillable = ['name', 'kanbanTable', 'order'];
    protected $primaryKey = 'id';
    protected $table = 'kanban_column';
    public $timestamps = false;
}