<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email',
     'phone', 'birthdate', 
     'address', 'profile_picture', 
     'status', 'created_at', 
     'updated_at', 'deleted_at'];

}
