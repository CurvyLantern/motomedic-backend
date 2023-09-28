<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_paper_id', 'invoice_seller_id', 'invoice_total_cost', 'invoice_total_due', 'purchased_products', 'type'];

    protected $casts = [
        'purchased_products' => 'array', // Cast the purchased_products attribute as an array
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class, 'invoice_seller_id');
    }

    public function updateInventory()
    {
        foreach ($this->purchased_products as $productData) {
            $sku = $productData['sku'];
            $quantity = $productData['quantity'];

            // Find the inventory item based on the SKU
            $inventory = Inventory::where('sku', $sku)->first();

            if ($inventory) {
                // Update the stock count based on the quantity purchased
                $inventory->stock_count += $quantity;
                $inventory->save();
            } else {
                // Handle the case where the SKU doesn't exist in the inventory
                // You might want to log an error or take appropriate action.
            }
        }
    }
}
