<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public static $wrap = '';
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $subCategories = CategoryResource::collection($this->whenLoaded('children'));
        return  [
            'id' => $this->id,
            'name' => $this->name,
            'sub_categories' => $subCategories,
            // Add other properties you want to include
        ];
    }
}
