<?php

namespace App\Http\Controllers;

use App\Models\InventoryRecord;
use App\Http\Requests\StoreInventoryRecordRequest;
use App\Http\Requests\UpdateInventoryRecordRequest;

class InventoryRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryRecordRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryRecord $inventoryRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryRecordRequest $request, InventoryRecord $inventoryRecord)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryRecord $inventoryRecord)
    {
        //
    }
}
