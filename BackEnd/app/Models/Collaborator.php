<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;


class Collaborator extends Authenticatable
{
    
    use HasFactory, HasApiTokens, Notifiable;
    protected $fillable = ['id','firstName', 'lastName', 'phone', 'password', 'email','status','invitationToken', 'picture'];
    protected $primaryKey = 'id';
    protected $hidden = [ 'password'];
    protected $table = 'collaborator';
    public $timestamps = false;
}
