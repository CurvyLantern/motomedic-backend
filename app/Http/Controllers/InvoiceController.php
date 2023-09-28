<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;

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
        //
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
