<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'access_time',
        'status',
        'reason',
        'created_at',
        'updated_at',
    ];
}
