<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category_id',
    ];

    protected $appends = ['qr_code_image'];

    protected static function booted()
    {
        static::creating(function ($product) {
        });

        static::created(function ($product) {
            $product->qr_code = 'PROD-' . str_pad($product->id, 5, '0', STR_PAD_LEFT);
            $product->saveQuietly(); 
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getQrCodeImageAttribute()
    {
        if (!$this->qr_code) return null;
    
        return 'data:image/svg+xml;base64,' . base64_encode(
            QrCode::format('svg')->size(200)->generate($this->qr_code)
        );
    }    

}
