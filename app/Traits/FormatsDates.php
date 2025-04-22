<?php

namespace App\Traits;

use Carbon\Carbon;

trait FormatsDates
{ 
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->locale('es')->isoFormat('D MMM YYYY');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->locale('es')->isoFormat('D MMM YYYY');
    }

    public function getPaymentDateAttribute($value)
    {
        return Carbon::parse($value)->locale('es')->isoFormat('D MMM YYYY');
    }

    public function getEndDateAttribute($value)
    {
        return Carbon::parse($value)->locale('es')->isoFormat('D MMM YYYY');
    }

}
