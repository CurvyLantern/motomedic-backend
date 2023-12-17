<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      // 'customer_id' => $this->customer_id,
      // 'seller_id' => $this->seller_id,
      'note' => $this->note,
      'status' => $this->status,
      'time_status' => $this->time_status,
      'payment_status' => $this->payment_status,

      'paid_amount' => $this->paid_amount,

      'created_at' => $this->created_at,
      'started_at' => $this->started_at,
      'finished_at' => $this->finished_at,

      'total_price' => $this->total_price,
      'overall_discount' => $this->overall_discount,
      'overall_discount_type' => $this->overall_discount_type,
      'overall_tax' => $this->overall_tax,
      'overall_tax_type' => $this->overall_tax_type,
      'customer' => new CustomerResource($this->whenLoaded('customer')),
      'seller' => new UserResource($this->whenLoaded('seller')),
      'serviceOrderItems' => ServiceOrderItemResource::collection($this->whenLoaded('serviceOrderItems')),
      'productOrderItems' => ProductOrderItemResource::collection($this->whenLoaded('productOrderItems')),
      // Add other relationships as needed
    ];
  }
}
