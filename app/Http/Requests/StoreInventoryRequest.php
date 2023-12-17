<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryRequest extends FormRequest
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
      'inventory_vendor_id' => 'required|string',
      'inventory_date' => 'required|date',
      'inventory_products' => 'required|array',
      'inventory_products.*.inventory_updater_id' => 'required|string',
      // 'inventory_products.*.inventory_vendor_id' => 'required|string',
      'inventory_products.*.new_buying_price' => 'required|numeric',
      'inventory_products.*.new_selling_price' => 'required|numeric',
      'inventory_products.*.product_sku' => 'required|string',
      'inventory_products.*.stock_count' => 'required|numeric',
      'inventory_products.*.type' => 'required|in:store_in,store_out',
    ];
  }
}
