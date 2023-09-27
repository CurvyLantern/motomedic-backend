<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'invoice_paper_id' => 'required',
            'invoice_seller_id' => 'required',
            'invoice_total_cost' => 'required',
            'invoice_total_due' => 'required',
            'invoice_products' => 'required',
        ];
    }
}
