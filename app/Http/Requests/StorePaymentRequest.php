<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
    public function rules()
    {
        return [
            'membership_id'   => 'required|exists:memberships,id',
            'payment_method'  => 'required|string|max:255',
            'reference'       => 'nullable|string|max:255',
            'payment_date'    => 'required|date',
        ];
    }

    public function messages()
    {
        return [
            'membership_id.required'   => 'La membresía es obligatoria.',
            'membership_id.exists'     => 'La membresía seleccionada no existe.',
            'payment_method.required'  => 'El método de pago es obligatorio.',
            'payment_method.string'    => 'El método de pago debe ser texto.',
            'reference.string'         => 'La referencia debe ser texto.',
            'payment_date.required'    => 'La fecha de pago es obligatoria.',
            'payment_date.date'        => 'La fecha de pago no tiene un formato válido.',
        ];
    }
}
