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
        return false;
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
            'slug' => "required",
            'categoryId' => "required",
            'brandId' => "required",
            'model' => "required",
            'color' => "required",
            'tags' => "required",
            'productType' => "required",
            'material' => "required",
            'size' => "required",
            'year' => "required",
            'compitibility' => "required",
            'condition' => "required",
            'manufacturer' => "required",
            'weight' => "required",
            'quantity' => "required",
            'price' => "required",
            'discount' => "required",
            'discoundType' => "required",
            'primaryImg' => "required",
            'thumbImg' => "required",
            'shortDescriptions' => "required",
            'longDescriptions' => "required",
            'installationMethod' => "required",
            'note' => "required",
            'warranty' => "required",
            'rating' => "required",
            'availability' => "required",
            'status' => "required",
        ];
    }
}
