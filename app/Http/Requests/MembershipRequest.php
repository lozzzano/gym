<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MembershipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'membership_type_id' => 'required|exists:membership_types,id', // Cambia "type" por "membership_type_id"
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'required|string|in:active,expired,suspended',
            'price' => 'required|numeric|min:0',
        ];
        
    }

    public function messages()
    {
        return [
            'client_id.required' => 'El cliente es obligatorio.',
            'client_id.exists' => 'El cliente seleccionado no existe.',
            'type.required' => 'El tipo de membresía es obligatorio.',
            'type.in' => 'El tipo de membresía debe ser mensual, anual o semanal.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'start_date.date' => 'La fecha de inicio debe ser válida.',
            'end_date.required' => 'La fecha de finalización es obligatoria.',
            'end_date.date' => 'La fecha de finalización debe ser válida.',
            'end_date.after' => 'La fecha de finalización debe ser posterior a la de inicio.',
            'status.required' => 'El estado de la membresía es obligatorio.',
            'status.in' => 'El estado debe ser active, expired o suspended.',
            'price.required' => 'El precio de la membresía es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'price.min' => 'El precio no puede ser negativo.',
        ];
    }
}
