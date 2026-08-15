<?php

namespace Tests\Unit;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_delivery_date_is_cast_to_datetime()
    {
        $order = Order::create([
            'tracking_token' => 'DM-TEST-TEST',
            'user_id' => 1,
            'order_status_id' => 1,
            'customer_name' => 'Test User',
            'customer_email' => 'test@example.com',
            'customer_phone' => '1234567890',
            'is_delivery' => true,
            'delivery_address' => 'Calle Falsa 123',
            'delivery_date' => '2026-08-15 14:30:00',
            'items_amount' => 1,
            'total_amount' => 100,
        ]);

        $this->assertInstanceOf(Carbon::class, $order->delivery_date);
        $this->assertSame('2026-08-15 14:30:00', $order->delivery_date->format('Y-m-d H:i:s'));
    }
}
