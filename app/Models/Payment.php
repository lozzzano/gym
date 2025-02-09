<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'membership_id',
        'amount',
        'payment_method',
        'reference',
        'payment_date',
        'created_at',
        'updated_at',
    ];
}
