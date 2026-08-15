<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'image' => $this->image ? get_image_path($this->image) : null,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'is_customizable' => $this->is_customizable,
            'category' => new CategoryResource($this->whenLoaded('category')),
            // 1. Mantenemos la lista plana por si la necesitas
            'default_options' => CustomOptionResource::collection($this->whenLoaded('defaultOptions')),
            // 2. NUEVO: Enviamos las opciones ya agrupadas para el Configurador
            'default_options_grouped' => $this->whenLoaded('defaultOptions', function () {
                return $this->defaultOptions->groupBy('custom_attribute_id');
            }),
            // 'attribute' => CustomAttributeResource::collection($this->whenLoaded('attributes')), // new
        ];
    }
}
