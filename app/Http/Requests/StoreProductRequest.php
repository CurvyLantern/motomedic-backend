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
        return [
            'name' => "required",
            'category_id' => "required",
            'brand_id' => "required",
            'model' => "required",
            'color_id' => "required",
            'material' => "nullable",
            'weight' => "required",
            'year' => "nullable",
            'price' => "required",
            'description' => "required",
            'warranty' => "required",
            'status' => "required",
            'image' => "image|nullable",
            'variation_enabled' => 'boolean|required'
        ];
    }
}
