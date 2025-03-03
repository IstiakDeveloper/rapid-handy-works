import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function ContactIndex({ contactInfo, faqs, locations, success, error }) {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);

    // Initialize Inertia form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service_type: '',
        message: '',
    });

    // Process flash messages
    useEffect(() => {
        if (success) {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);
        }
        if (error) {
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 5000);
        }
    }, [success, error]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => {
                reset('name', 'email', 'phone', 'subject', 'service_type', 'message');
            },
        });
    };

    // Toggle FAQ accordion
    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <GuestLayout>
            <Head title="Contact Us" />

            {/* Success/Error Messages */}
            {showSuccessMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-0 left-0 right-0 z-50 max-w-lg px-4 py-3 mx-auto mt-6 text-green-700 bg-green-100 border border-green-400 rounded-lg shadow-lg"
                >
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        <span>{success}</span>
                    </div>
                </motion.div>
            )}

            {showErrorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-0 left-0 right-0 z-50 max-w-lg px-4 py-3 mx-auto mt-6 text-red-700 bg-red-100 border border-red-400 rounded-lg shadow-lg"
                >
                    <div className="flex items-center">
                        <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                </motion.div>
            )}

            {/* Contact Header Section */}
            <div className="relative py-12 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="absolute rounded-full opacity-20 -top-24 -right-24 w-96 h-96 bg-amber-300"></div>
                <div className="absolute bottom-0 w-64 h-64 rounded-full opacity-20 left-10 bg-amber-400"></div>

                <div className="relative z-10 px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-3xl mx-auto mt-4 text-xl text-gray-600"
                        >
                            Have questions about our services? We're here to help you.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards and Form Section */}
            <div className="py-12 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                            <p className="mt-3 text-gray-600">
                                Reach out to us through any of these channels. We strive to respond to all inquiries within 24 hours.
                            </p>

                            <div className="mt-8 space-y-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 text-white rounded-md bg-amber-500">
                                            <PhoneIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                        <p className="mt-1 text-gray-600">{contactInfo.phone}</p>
                                        <p className="mt-1 text-sm text-gray-500">Mon-Fri from 8am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 text-white rounded-md bg-amber-500">
                                            <EnvelopeIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                        <p className="mt-1 text-gray-600">{contactInfo.email}</p>
                                        <p className="mt-1 text-sm text-gray-500">We'll respond as soon as possible</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 text-white rounded-md bg-amber-500">
                                            <MapPinIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Office</h3>
                                        <p className="mt-1 text-gray-600">{contactInfo.address}</p>
                                        <p className="mt-1 text-sm text-gray-500">Come visit us</p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 text-white rounded-md bg-amber-500">
                                            <ClockIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Working Hours</h3>
                                        <p className="mt-1 text-gray-600">{contactInfo.hours}</p>
                                        <p className="mt-1 text-sm text-gray-500">Emergency services available 24/7</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900">Follow Us</h3>
                                <div className="flex mt-4 space-x-6">
                                    <a href={contactInfo.social.facebook} className="text-gray-500 hover:text-amber-500">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href={contactInfo.social.instagram} className="text-gray-500 hover:text-amber-500">
                                        <span className="sr-only">Instagram</span>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href={contactInfo.social.twitter} className="text-gray-500 hover:text-amber-500">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href={contactInfo.social.linkedin} className="text-gray-500 hover:text-amber-500">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="p-8 bg-white rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                                <p className="mt-2 text-gray-600">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Full Name
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className={`mt-1 block w-full px-3 py-2 border ${errors.subject ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
                                            />
                                            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                                            Service Type (Optional)
                                        </label>
                                        <select
                                            id="service_type"
                                            name="service_type"
                                            value={data.service_type}
                                            onChange={e => setData('service_type', e.target.value)}
                                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="">Select a service type</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Cleaning">Cleaning</option>
                                            <option value="Handyman">Handyman</option>
                                            <option value="Home Improvement">Home Improvement</option>
                                            <option value="Landscaping">Landscaping</option>
                                            <option value="HVAC">HVAC</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className={`mt-1 block w-full px-3 py-2 border ${errors.message ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500`}
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full px-6 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Locations Section with Map */}
            <div className="py-12 bg-gray-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Our Locations</h2>
                        <p className="mt-4 text-gray-600">
                            Visit us at one of our office locations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 mt-10 lg:grid-cols-2">
                        {locations.map((location, index) => (
                            <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md">
                                <div className="h-56 bg-gray-300">
                                    {/* Map placeholder - you would implement a real map here */}
                                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-amber-100 to-amber-200">
                                        <MapPinIcon className="w-12 h-12 text-amber-500" />
                                        <span className="ml-2 text-lg font-medium text-gray-700">Map View</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                                    <p className="mt-2 text-gray-600">{location.address}</p>
                                    <div className="flex flex-col mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
                                        <div className="flex items-center">
                                            <PhoneIcon className="w-5 h-5 text-amber-500" />
                                            <span className="ml-2 text-gray-600">{location.phone}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <EnvelopeIcon className="w-5 h-5 text-amber-500" />
                                            <span className="ml-2 text-gray-600">{location.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-12 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        <p className="mt-4 text-gray-600">
                            Find answers to the most common questions about our services.
                        </p>
                    </div>

                    <div className="mt-10">
                        {faqs.map((faq, index) => (
                            <div key={index} className="mt-5">
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="flex items-center justify-between w-full p-5 text-left rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                >
                                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transform ${activeQuestion === index ? 'rotate-180' : 'rotate-0'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {activeQuestion === index && (
                                    <div className="p-5 mt-2 bg-white rounded-lg shadow-md">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-12 bg-amber-500">
                <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-amber-100">
                        Discover how our services can help you solve your problems today.
                    </p>
                    <div className="mt-8">
                        <a
                            href="/services"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-white border border-transparent rounded-md shadow-sm text-amber-600 hover:bg-amber-50"
                        >
                            Explore Our Services
                        </a>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
