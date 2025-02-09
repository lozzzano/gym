<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'type',
    'start_date', 'end_date',
    'status', 'price',
    'created_at', 'updated_at'];
}
