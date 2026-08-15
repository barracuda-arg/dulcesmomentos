<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomAttributeResource extends JsonResource
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
            'is_multiple' => $this->is_multiple,
            'is_required' => $this->is_required,
            'step_number' => $this->step_number,
            'options' => CustomOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
