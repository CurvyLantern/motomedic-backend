<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateServiceRequest extends FormRequest
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
      'customer_id' => 'required',
      // 'service_type_id' => 'nullable|exists:service_types,id',
      'service_type_ids' => 'nullable|array',
      'service_type_ids.*' => 'exists:service_types,id',
      'seller_id' => 'nullable|exists:users,id',
      'problem_details' => 'nullable',
      // 'total_price' => 'required|numeric',
      // 'unit_price' => 'required|numeric',
      // 'tax' => 'required|integer',
      // 'discount' => 'required|integer',
    ];
  }
}
