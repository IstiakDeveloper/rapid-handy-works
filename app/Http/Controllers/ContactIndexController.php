<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmission;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ContactIndexController extends Controller
{
    public function index()
    {
        // Company contact information
        $contactInfo = [
            'email' => 'info@rapidhandywork.com',
            'phone' => '+1 (555) 123-4567',
            'address' => '123 Service Street, Suite 100, City, State 12345',
            'hours' => 'Monday - Friday: 8:00 AM - 6:00 PM',
            'social' => [
                'facebook' => 'https://facebook.com/rapidhandywork',
                'twitter' => 'https://twitter.com/rapidhandywork',
                'instagram' => 'https://instagram.com/rapidhandywork',
                'linkedin' => 'https://linkedin.com/company/rapidhandywork',
            ]
        ];

        // FAQs for the contact page
        $faqs = [
            [
                'question' => 'How do I book a service?',
                'answer' => 'You can book a service through our website by browsing available services, selecting the one you need, and following the booking process. Alternatively, you can contact our customer service team for assistance.'
            ],
            [
                'question' => 'What is your cancellation policy?',
                'answer' => 'You can cancel a booking up to 24 hours before the scheduled service without any charges. Cancellations made less than 24 hours in advance may be subject to a cancellation fee.'
            ],
            [
                'question' => 'Are your service providers vetted?',
                'answer' => 'Yes, all service providers on our platform undergo a thorough vetting process, including background checks, skills assessment, and verification of credentials and experience.'
            ],
            [
                'question' => 'What if I\'m not satisfied with the service?',
                'answer' => "Customer satisfaction is our priority. If you're not completely satisfied with a service, please contact us within 48 hours, and we'll work to resolve the issue or offer a partial or full refund as appropriate."
            ],
            [
                'question' => 'Do you offer emergency services?',
                'answer' => 'Yes, for certain categories like plumbing and electrical work, we offer emergency services available 24/7. Additional charges may apply for emergency bookings.'
            ],
        ];

        // Office locations
        $locations = [
            [
                'name' => 'Main Office',
                'address' => '123 Service Street, Suite 100, City, State 12345',
                'phone' => '+1 (555) 123-4567',
                'email' => 'info@rapidhandywork.com',
                'coordinates' => ['lat' => 40.7128, 'lng' => -74.0060], // NYC coordinates as example
            ],
            [
                'name' => 'West Coast Office',
                'address' => '456 Handy Avenue, Suite 200, West City, State 67890',
                'phone' => '+1 (555) 987-6543',
                'email' => 'westcoast@rapidhandywork.com',
                'coordinates' => ['lat' => 34.0522, 'lng' => -118.2437], // LA coordinates as example
            ],
        ];

        return Inertia::render('Contact/Index', [
            'contactInfo' => $contactInfo,
            'faqs' => $faqs,
            'locations' => $locations,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function submit(Request $request)
    {
        // Validate the form data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'service_type' => 'nullable|string|max:255',
        ]);

        try {
            // Send email notification
            Mail::to('contact@rapidhandywork.com')->send(new ContactFormSubmission($validated));

            // Store in database if needed
            // ContactInquiry::create($validated);

            return redirect()->back()->with('success', 'Thank you for your message! We will get back to you as soon as possible.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'We encountered an issue sending your message. Please try again or contact us directly.');
        }
    }
}
