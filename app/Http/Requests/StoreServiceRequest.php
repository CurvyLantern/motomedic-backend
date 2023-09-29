<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
          'name' => "required",
          'service_type' => "required",
          'customer_id' => "required",
          'problem_details' => "nullable",
          'mechanic_id' => "required",
          'price' => "nullable",
          'items'=> "array | nullable ",
          'note' => "nullable",
          'status' => "nullable",
        ];
    }
}
