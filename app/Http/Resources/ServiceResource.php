<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'serviceName'  => $this->serviceName,
            'slug' => $this->slug,
            'description' => $this->description,
            'img' => $this->img,
            'price' => $this->price,
            'durationHours' => $this->durationHours,
            'featured' => $this->featured,
            'note' => $this->note,
            'status' => $this->status,

        ];
    }
}
