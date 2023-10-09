<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttributeRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize()
  {
    return true;
  }

  public function rules()
  {
    return [
      'name' => 'sometimes|string|max:255', // Allow updating the attribute name if present
      'attribute_values' => 'sometimes|array', // Allow updating attribute
    ];
  }
}
