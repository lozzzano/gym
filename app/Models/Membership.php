<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'membership_type_id',
    'start_date', 'end_date',
    'status', 'price',
    'created_at', 'updated_at'];

    protected $appends = ['must_pay', 'real_status', 'formatted_start_date'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }

    public function productSales() {
        return $this->hasMany(ProductSale::class);
    }

    // Una membresía pertenece a un tipo de membresía
    public function membershipType()
    {
        return $this->belongsTo(MembershipType::class, 'membership_type_id');
    }

    public function getMustPayAttribute()
    {
        $membershipPrice = 0;

        // ¿Debe pagar membresía?
        if ($this->payments()->sum('amount') < $this->price) {
            $membershipPrice = $this->price;
        }

        $unpaidProductsTotal = $this->productSales()
            ->where('paid', false)
            ->sum('total');

        return $membershipPrice + $unpaidProductsTotal;
    }

    public function getRealStatusAttribute()
    {
        if ($this->status === 'suspended') {
            return 'suspended';
        }

        $now = now();

        if ($now->lt($this->start_date)) {
            return 'pending'; // aún no comienza
        }

        if ($now->gt($this->end_date)) {
            return 'expired';
        }

        return 'active';
    }

    public function getFormattedStartDateAttribute()
    {
        return Carbon::parse($this->start_date)->locale('es')->isoFormat('D MMM YYYY');
    }

    // Auto-calcular la fecha de expiración al crear una membresía
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($membership) {
            $membershipType = MembershipType::find($membership->membership_type_id);

            if ($membershipType) {
                // Calcula la fecha de expiración automáticamente
                $membership->end_date = now()->addMonths($membershipType->duration);

                // Asigna el precio solo si no se ha definido
                if (!$membership->price) {
                    $membership->price = $membershipType->price;
                }
            }
        });
    }

}
