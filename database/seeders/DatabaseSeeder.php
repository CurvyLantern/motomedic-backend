<?php

namespace Database\Seeders;


// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Mechanic;
use App\Models\Order;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use App\Models\Color;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Seller;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::factory(2)->create();
        Customer::factory(10)->create();
        Mechanic::factory(10)->create();
        Service::factory(10)->create();
        Color::factory(100)->create();
        Brand::factory(10)->create();
        Category::factory(10)->create();

        Product::factory(20)->create();
        Order::factory(10)->create();

        Seller::factory(10)->create();
        Invoice::factory(15)->create();
    }
}
