<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
      'name' => "nullable",
      'category_id' => "nullable",
      'brand_id' => "nullable",
      'model' => "nullable",
      'color_id' => "nullable",
      'material' => "nullable",
      'weight' => "nullable",
      'year' => "nullable",
      'price' => "nullable",
      'description' => "nullable",
      'warranty' => "nullable",
      'status' => "nullable",
    ];
  }
}
