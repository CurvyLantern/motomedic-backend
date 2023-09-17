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
            'productName' => "required",
            'categoryId' => "required",
            'brandId' => "required",
            'model' => "required",
            'color' => "required",
            'material' => "required",
            'size' => "required",
            'year' => "required",
            'compitibility' => "required",
            'condition' => "required",
            'weight' => "required",
            'quantity' => "required",
            'price' => "required",
            'discount' => "required",
            'primaryImg' => "required",
            'shortDescriptions' => "required",
            'availability' => "required",
            'status' => "required",
            'thumbImg' => 'required',
            'thumbImg.*' => 'mimes:jpg,png'
        ];
    }
}
