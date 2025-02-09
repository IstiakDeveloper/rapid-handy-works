<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
          // Create Admin User
          User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Service Categories
        $categories = [
            'Plumbing' => 'All plumbing related services',
            'Electrical' => 'All electrical work services',
            'Carpentry' => 'All wood work and furniture services',
            'Painting' => 'All painting related services',
            'Cleaning' => 'All cleaning related services',
            'AC Repair' => 'All AC maintenance and repair services',
        ];

        foreach ($categories as $name => $description) {
            ServiceCategory::create([
                'name' => $name,
                'description' => $description,
                'slug' => str()->slug($name),
            ]);
        }

        // Create Default Settings
        $settings = [
            'site_name' => 'HandyWork Services',
            'site_description' => 'Your trusted platform for professional handyman services',
            'contact_email' => 'contact@handywork.com',
            'contact_phone' => '+880 1234567890',
            'address' => 'Dhaka, Bangladesh',
            'currency' => 'BDT',
            'booking_fee_percentage' => '10',
            'minimum_booking_amount' => '500',
        ];

        foreach ($settings as $key => $value) {
            Setting::create([
                'key' => $key,
                'value' => $value,
                'group' => 'general',
            ]);
        }
    }
}
