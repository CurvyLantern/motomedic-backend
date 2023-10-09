<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Inventory;

class InvoiceController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $mechanics = Invoice::orderBy('id', 'asc')->paginate(15);

    return InvoiceResource::collection($mechanics);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreInvoiceRequest $request)
  {
    $validated = $request->validated();

    $products = $validated['invoice_products'];

    foreach ($products as $product) {
      $inventory = Inventory::where('sku', $product['product_sku'])->first();
      $inventory->stock_count = $inventory->stock_count + $product['stock_count'];
      $inventory->save();
    }

    $invoice = Invoice::create([
      'invoice_paper_id' => $validated['invoice_paper_id'],
      'invoice_seller_id' => $validated['invoice_seller_id'],
      'invoice_total_cost' => $validated['invoice_total_cost'],
      'invoice_total_due' => $validated['invoice_total_due'],
      'type' => $validated['type'],
      'purchased_products' => (int)$validated['invoice_products'],
    ]);

    return response()->json(compact('invoice'));
  }

  /**
   * Display the specified resource.
   */
  public function show(Invoice $invoice)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateInvoiceRequest $request, Invoice $invoice)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Invoice $invoice, $id)
  {
    try {
      $invoice = Invoice::find($id);
      if ($invoice) {
        $invoice->delete();
      } else {
        return send_response('Customer Not Found !', []);
      }
      return send_response('Customer Deleted successfully', []);
    } catch (Exception $e) {
      return send_error($e->getMessage(), $e->getCode());
    }
  }
}
