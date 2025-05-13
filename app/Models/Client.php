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

    public function accessLogs()
    {
        return $this->hasMany(AccessLog::class);
    }

    public function getAccessStatusAttribute()
    {
        $status = $this->membership->real_status ?? null;

        if ($status !== 'active') {
            $mensaje = match ($status) {
                'pending'   => 'Membresía aún no inicia',
                'expired'   => 'Membresía expirada',
                'suspended' => 'Membresía suspendida',
                default     => 'Membresía no válida'
            };

            return ['allowed' => false, 'reason' => $mensaje];
        }

        // Verificar si tiene una entrada sin salida
        if ($this->accessLogs()->whereNull('checkout')->exists()) {
            return ['allowed' => true, 'reason' => 'Debes registrar tus salidas'];
        }

        return ['allowed' => true, 'reason' => 'Acceso permitido'];
    }

}
