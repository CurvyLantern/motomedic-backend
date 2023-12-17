<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
    $rules = [
      'name' => "required",
      'category_id' => "required",
      'brand_id' => "required",
      'color_id' => "nullable",
      'weight' => "nullable",
      'description' => "nullable",
      'warranty' => "nullable",
      'status' => "required",

      'barcode' => 'nullable',
      'model_id' => 'nullable',

      // 'image' => "image|nullable",
      'variation_enabled' => 'boolean|required',
      // 'variations' => 'array',
      // 'variations.*.attribute_value_ids' => 'required|array',
      // 'variations.*.attribute_value_ids.*' => 'required|string',
      // 'variations.*.barcode' => 'nullable|string',
      // 'variations.*.color_id' => 'nullable|string',
      // 'variations.*.model_id' => 'nullable|string'
    ];

    // if ($this->input('variation_enabled')) {
    //   $rules['barcode'] = 'nullable';
    //   $rules['model_id'] = 'nullable';
    // } else {
    //   $rules['model_id'] = 'required';
    //   $rules['barcode'] = 'required';
    // }

    return $rules;
  }
}
