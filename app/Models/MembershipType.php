<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'duration', 'price'];

    // Una membresía puede ser usada en varias relaciones con clientes
    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }
}
