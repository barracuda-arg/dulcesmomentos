<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomOptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image ? get_image_path($this->image) : null,
            'additional_price' => $this->additional_price,
            'is_active' => $this->is_active,
        ];
    }
}
