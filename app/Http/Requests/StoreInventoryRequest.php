<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryRequest extends FormRequest
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
      'type' => 'required|in:buying,selling',
      'inventory_seller_id' => 'required',
      'inventory_total_cost' => 'required',
      'inventory_total_due' => 'required',
      'inventory_products' => 'required',
    ];
  }
}
