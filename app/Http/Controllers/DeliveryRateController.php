<?php

namespace App\Http\Controllers;

use App\Models\DeliveryRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/delivery-rates/index', [
            'rates' => DeliveryRate::orderBy('max_distance_km', 'asc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'max_distance_km' => 'required|numeric|min:0|unique:delivery_rates,max_distance_km',
            'price' => 'required|numeric|min:0',
        ]);

        DeliveryRate::create($validated);

        return redirect()->back()->with('success', 'Rango de envío agregado.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DeliveryRate $delivery_rate)
    {
        $validated = $request->validate([
            'max_distance_km' => 'required|numeric|min:0|unique:delivery_rates,max_distance_km,' . $delivery_rate->id,
            'price' => 'required|numeric|min:0',
        ]);

        $delivery_rate->update($validated);

        return redirect()->back()->with('success', 'Rango actualizado.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeliveryRate $delivery_rate)
    {
        $delivery_rate->delete();

        return redirect()->back()->with('success', 'Rango eliminado.');
    }
}
