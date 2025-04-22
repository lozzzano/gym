<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'membership_id',
        'product_id',
        'quantity',
        'total',
        'paid',
    ];

    public function membership() {
        return $this->belongsTo(Membership::class);
    }
    
    public function product() {
        return $this->belongsTo(Product::class);
    }    

}
