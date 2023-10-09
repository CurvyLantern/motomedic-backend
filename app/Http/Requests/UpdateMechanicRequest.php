<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMechanicRequest extends FormRequest
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
    $mechanicId = $this->route('mechanic');
    return [
      'name' => 'string|nullable',
      'email' => 'nullable|email|unique:mechanics,email,' . $mechanicId,
      'phone' => 'nullable|unique:mechanics,phone,' . $mechanicId,
      'address' => 'nullable|string',
      'status' => 'nullable|in:idle,busy,absent',
    ];
  }
}
