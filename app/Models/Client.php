<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\FormatsDates;

class Client extends Model
{
    use HasFactory;
    use FormatsDates;

    protected $fillable = ['name', 'email',
     'phone', 'birthdate', 
     'address', 'profile_picture', 'face_encoding',
     'status', 'created_at', 
     'updated_at', 'deleted_at'];

    protected $appends = ['access_status'];

     public function membership()
     {
         return $this->hasOne(Membership::class);
     }
     
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getAccessStatusAttribute()
    {
        if (!$this->membership || !$this->membership->real_status != "active") {
            return ['allowed' => false, 'reason' => 'Membresía inactiva'];
        }

        if ($this->accessLogs()->whereNull('checkout')->exists()) {
            return ['allowed' => true, 'reason' => 'Debes registrar tus salidas'];
        }

        return ['allowed' => true, 'reason' => 'Acceso permitido'];
    }


}
