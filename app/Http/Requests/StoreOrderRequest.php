<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
    //         return [
    //             'customer_id' => "required",
    // //            'total' => "nullable",
    //             'discount' => "nullable",
    //             'tax' => "nullable",
    //             'note' => "nullable",
    //             'status' => "nullable",

    //         ];
    return [
      'customer_id' => "required",
      'total' => "required",
      'discount' => 'nullable',
      'tax' => 'nullable',
      'note' => 'nullable',
      'status' => 'nullable',
      'type' => 'required|in:product,service',
      'items' => 'required|array',
      // 'items.*.id' => 'required|exists:' . ($this->input('type') === 'product' ? 'products' : 'services') . ',id',
      "items.*.id" => "required",
      'items.*.sku' => 'required',
      'items.*.quantity' => 'required|integer|min:1',
      'items.*.total_price' => 'required|numeric|min:0',
      'items.*.unit_price' => 'required|numeric|min:0',
    ];
  }
}
