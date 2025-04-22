<?php

namespace App\Observers;

use App\Models\Membership;

class MembershipObserver
{
    public function saving(Membership $membership)
    {
        // Si el status es suspendido, no tocamos nada (es manual)
        if ($membership->status === 'suspended') return;

        // Si la fecha actual ya pasó el end_date, está expirada
        if (now()->gt($membership->end_date)) {
            $membership->status = 'expired';
        } else {
            $membership->status = 'active';
        }
    }
    /**
     * Handle the Membership "created" event.
     */
    public function created(Membership $membership): void
    {
        //
    }

    /**
     * Handle the Membership "updated" event.
     */
    public function updated(Membership $membership): void
    {
        //
    }

    /**
     * Handle the Membership "deleted" event.
     */
    public function deleted(Membership $membership): void
    {
        //
    }

    /**
     * Handle the Membership "restored" event.
     */
    public function restored(Membership $membership): void
    {
        //
    }

    /**
     * Handle the Membership "force deleted" event.
     */
    public function forceDeleted(Membership $membership): void
    {
        //
    }
}
