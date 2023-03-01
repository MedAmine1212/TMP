<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;



class ForgotPasswordRequest extends Model
{
    
    use HasFactory;
    protected $fillable = ['collaborator', 'token'];
    protected $primaryKey = 'id';
    protected $table = 'forgot_password_request';
    public $timestamps = false;


public function collaborator(): BelongsTo
{
    return $this->belongsTo('App\Models\Collaborator', 'id');
}
}

