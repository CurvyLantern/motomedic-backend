<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
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
      // 'customerId'=> "required",
      // 'serviceId' => "required",
      // 'productId' => "required",
      // 'subtotal' => "required",
      // 'total' => "required",
      // 'tax' => "required",
      // 'discount' => "required",
      // 'note' => "required",
      // 'extra' => "required",
      // 'serviceStatus' => "required",
      // 'queue' => "required",
    ];
  }
}
