<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\FormatsDates;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    use FormatsDates;

    protected $fillable = [
        'client_id',
        'membership_id',
        'amount',
        'payment_method',
        'reference',
        'image',
        'payment_date',
        'created_at',
        'updated_at',
    ];

    public function membership() {
        return $this->belongsTo(Membership::class);
    }
    
    public function client() {
        return $this->belongsTo(Client::class);
    }
}
