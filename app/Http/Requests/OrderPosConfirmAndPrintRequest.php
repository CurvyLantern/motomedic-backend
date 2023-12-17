<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderPosConfirmAndPrintRequest extends FormRequest
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
    return [
      'order_id' => 'nullable',
      'seller_id' => 'required',
      'customer_id' => 'required',
      'total' => 'required',
      'overallDiscountPrice' => 'required',
      'overallDiscountAmount' => 'required',
      'overallDiscountType' => 'required|in:flat,percent',
      'taxPrice' => 'required',
      'taxAmount' => 'required',
      'taxType' => 'required|in:flat,percent',
      'note' => 'nullable|string',
      'status' => 'required|in:paid,unpaid,cancelled',
      'items' => 'required|array',
      'items.*.product_sku' => 'required|string',
      'items.*.type' => 'required|in:product,variation',
      'items.*.status' => 'required|in:paid,unpaid,cancelled,due',
      'items.*.quantity' => 'required|integer',
      'items.*.unit_price' => 'required',
      'items.*.total_price' => 'required',
      'items.*.discount' => 'required',
      'items.*.discountType' => 'required|in:flat,percent',
    ];
  }
}
