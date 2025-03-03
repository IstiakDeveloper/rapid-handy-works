<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AboutIndexController extends Controller
{
    public function index()
    {
        // Get count of service providers
        $providersCount = User::where('role', 'provider')
            ->where('is_active', true)
            ->count();

        // Get count of completed services/jobs (adjust this based on your actual model/field names)
        $completedJobsCount = Booking::where('status', 'completed')->count();

        $teamMembers = [
            [
                'name' => 'Ahmed Rahman',
                'position' => 'Founder & CEO',
                'bio' => 'With over 15 years of experience in the service industry, Ahmed founded Rapid Handy Work with a vision to connect skilled professionals with customers seeking quality services.',
                'avatar' => 'https://ui-avatars.com/api/?name=Ahmed+Rahman&background=f59e0b&color=fff'
            ],
            [
                'name' => 'Sarah Khan',
                'position' => 'Operations Director',
                'bio' => 'Sarah oversees daily operations and ensures that all service providers maintain our high quality standards. She has a background in logistics and customer service excellence.',
                'avatar' => 'https://ui-avatars.com/api/?name=Sarah+Khan&background=f59e0b&color=fff'
            ],
            [
                'name' => 'Mohammad Ali',
                'position' => 'Technology Lead',
                'bio' => 'Mohammad manages our technology platform, ensuring a seamless experience for both customers and service providers. He has a passion for creating intuitive digital solutions.',
                'avatar' => 'https://ui-avatars.com/api/?name=Mohammad+Ali&background=f59e0b&color=fff'
            ],
            [
                'name' => 'Fatima Hussain',
                'position' => 'Customer Relations',
                'bio' => 'Fatima leads our customer support team, ensuring that all clients receive prompt assistance and that their needs are met with the highest level of service.',
                'avatar' => 'https://ui-avatars.com/api/?name=Fatima+Hussain&background=f59e0b&color=fff'
            ],
        ];

        // Company values
        $values = [
            [
                'title' => 'Quality Service',
                'description' => 'We are committed to providing top-quality services that meet or exceed customer expectations.',
                'icon' => 'star'
            ],
            [
                'title' => 'Trust & Reliability',
                'description' => 'We build trust through consistent reliability and transparent communication with our customers.',
                'icon' => 'shield-check'
            ],
            [
                'title' => 'Skilled Professionals',
                'description' => 'We work with vetted, highly skilled professionals who are experts in their respective fields.',
                'icon' => 'badge-check'
            ],
            [
                'title' => 'Customer Satisfaction',
                'description' => 'We prioritize customer satisfaction and strive to create positive experiences with every interaction.',
                'icon' => 'emoji-happy'
            ],
            [
                'title' => 'Accessibility',
                'description' => 'We aim to make professional services accessible to everyone through our easy-to-use platform.',
                'icon' => 'device-mobile'
            ],
            [
                'title' => 'Community Impact',
                'description' => 'We are dedicated to creating a positive impact in the communities we serve through reliable service and job creation.',
                'icon' => 'users'
            ],
        ];

        // Company timeline/milestones
        $milestones = [
            [
                'year' => '2018',
                'title' => 'Company Founded',
                'description' => 'Rapid Handy Work was founded with the mission to connect skilled professionals with customers in need.'
            ],
            [
                'year' => '2019',
                'title' => 'Expanded Service Categories',
                'description' => 'We expanded our service offerings to include over 15 different categories to better serve our customers.'
            ],
            [
                'year' => '2020',
                'title' => 'Mobile App Launch',
                'description' => 'We launched our mobile application to make booking services even more convenient for our customers.'
            ],
            [
                'year' => '2021',
                'title' => 'Quality Assurance Program',
                'description' => 'We implemented a comprehensive quality assurance program to ensure consistent service excellence.'
            ],
            [
                'year' => '2022',
                'title' => 'Regional Expansion',
                'description' => 'We expanded our services to three new regions, bringing quality service to more communities.'
            ],
            [
                'year' => '2023',
                'title' => 'Service Excellence Award',
                'description' => 'We were recognized with the Service Excellence Award for our commitment to quality and customer satisfaction.'
            ],
        ];

        return Inertia::render('About/Index', [
            'statistics' => [
                'providers' => $providersCount,
                'completedJobs' => $completedJobsCount,
                'serviceAreas' => 12, // Static number, replace with actual data if available
                'customerSatisfaction' => 98, // Static percentage, replace with actual data if available
            ],
            'teamMembers' => $teamMembers,
            'values' => $values,
            'milestones' => $milestones,
            'mission' => 'Our mission is to simplify access to high-quality home services by connecting skilled professionals with customers in need, creating a platform that values reliability, quality, and customer satisfaction.',
            'vision' => 'To be the most trusted platform for home services, known for exceptional quality, reliability, and customer experience in every community we serve.'
        ]);
    }
}
