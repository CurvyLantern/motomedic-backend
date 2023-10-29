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
      'model' => "nullable",
      'color_id' => "nullable",
      'material' => "nullable",
      'weight' => "nullable",
      'year' => "nullable",
      'price' => "nullable",
      'description' => "nullable",
      'warranty' => "nullable",
      'status' => "required",
      'image' => "image|nullable",
      'variation_enabled' => 'boolean|required'
    ];

    if ($this->input('variation_enabled')) {
      $rules['barcode'] = 'nullable';
    } else {
      $rules['barcode'] = 'required';
    }

    return $rules;
  }
}
