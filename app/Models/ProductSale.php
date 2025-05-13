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

    protected static function booted()
    {
        static::created(function ($productSale) {
            $product = $productSale->product;

            if ($product && $product->stock !== null) {
                $product->stock -= $productSale->quantity;
                $product->save();
            }
        });

        static::creating(function ($productSale) {
            $product = $productSale->product;
        
            if ($product && $product->stock < $productSale->quantity) {
                throw new \Exception("No hay suficiente stock para el producto: {$product->name}");
            }
        });
        
    }

    public function membership() {
        return $this->belongsTo(Membership::class);
    }
    
    public function product() {
        return $this->belongsTo(Product::class);
    }    

}
