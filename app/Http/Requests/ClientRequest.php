<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientRequest extends FormRequest
{
    /**
     * Determine si el usuario está autorizado para hacer esta solicitud.
     */
    public function authorize(): bool
    {
        return true; // Cambiar a true para permitir que todos los usuarios accedan.
    }

    /**
     * Obtiene las reglas de validación para esta solicitud.
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone' => 'nullable|numeric|unique:clients,phone',
            'birthdate' => 'nullable|date',
            'address' => 'nullable|string|max:255',
        ];

        // Si es una actualización, ignora el cliente actual en las reglas únicas
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $clientId = $this->route('client'); // Obtiene el ID del cliente de la URL
            $rules['email'] .= ",{$clientId}";
            $rules['phone'] .= ",{$clientId}";
        }

        return $rules;
    }
}
