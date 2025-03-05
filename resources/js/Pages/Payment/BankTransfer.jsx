import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    CreditCardIcon,
    CalendarDaysIcon,
    FileText,
    Clipboard,
    ClipboardCheck,
    CheckCircleIcon
} from 'lucide-react';

export default function BankTransfer({ auth, booking, bankDetails }) {
    const [copied, setCopied] = useState({
        accountName: false,
        accountNumber: false,
        sortCode: false,
        reference: false
    });

    const { data, setData, post, processing, errors } = useForm({
        transaction_id: '',
        transaction_date: '',
        notes: ''
    });

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied({...copied, [field]: true});
            setTimeout(() => setCopied({...copied, [field]: false}), 2000);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.bank-transfer.confirm', booking.reference_number));
    };

    // Parse booking fee as a number to ensure toFixed works
    const bookingFee = parseFloat(booking.calling_charge) || 0;

    return (
        <GuestLayout user={auth.user}>
            <Head title="Bank Transfer Payment" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-8 text-center">
                                <h1 className="mb-2 text-2xl font-bold text-gray-900">Bank Transfer Payment</h1>
                                <p className="text-gray-600">
                                    Please complete your payment using the bank details below
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="p-4 mb-8 rounded-lg bg-gray-50">
                                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Service:</p>
                                        <p className="font-medium">{booking.service.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date & Time:</p>
                                        <p className="font-medium">{booking.booking_date} at {booking.booking_time}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Booking Reference:</p>
                                        <p className="font-medium">{booking.reference_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Amount to Pay Now:</p>
                                        <p className="font-medium text-indigo-600">£{bookingFee.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div className="p-6 mb-8 border border-indigo-100 rounded-lg bg-indigo-50">
                                <h2 className="mb-4 text-lg font-semibold text-indigo-700">Bank Transfer Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-700">Account Name:</p>
                                            <p className="font-medium">{bankDetails.account_name}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.account_name, 'accountName')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                            type="button"
                                        >
                                            {copied.accountName ? (
                                                <ClipboardCheck className="w-5 h-5" />
                                            ) : (
                                                <Clipboard className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-700">Account Number:</p>
                                            <p className="font-medium">{bankDetails.account_number}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.account_number, 'accountNumber')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                            type="button"
                                        >
                                            {copied.accountNumber ? (
                                                <ClipboardCheck className="w-5 h-5" />
                                            ) : (
                                                <Clipboard className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-700">Sort Code:</p>
                                            <p className="font-medium">{bankDetails.sort_code}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.sort_code, 'sortCode')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                            type="button"
                                        >
                                            {copied.sortCode ? (
                                                <ClipboardCheck className="w-5 h-5" />
                                            ) : (
                                                <Clipboard className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-700">Payment Reference:</p>
                                            <p className="font-medium">{booking.reference_number}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(booking.reference_number, 'reference')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                            type="button"
                                        >
                                            {copied.reference ? (
                                                <ClipboardCheck className="w-5 h-5" />
                                            ) : (
                                                <Clipboard className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 mt-6 bg-white border border-indigo-200 rounded-md">
                                    <div className="flex items-start">
                                        <CheckCircleIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-900">Important:</span> Please include your reference number ({booking.reference_number}) in the payment reference field to help us identify your payment.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Confirmation Form */}
                            <form onSubmit={handleSubmit}>
                                <h2 className="mb-4 text-lg font-semibold">Confirm Your Payment</h2>
                                <p className="mb-4 text-sm text-gray-600">
                                    After you've made the bank transfer, please fill in the details below to help us verify your payment.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="transaction_id" className="block mb-1 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <CreditCardIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Transaction ID / Reference
                                            </div>
                                        </label>
                                        <input
                                            id="transaction_id"
                                            type="text"
                                            value={data.transaction_id}
                                            onChange={(e) => setData('transaction_id', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Enter the transaction ID or reference"
                                            required
                                        />
                                        {errors.transaction_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.transaction_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="transaction_date" className="block mb-1 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <CalendarDaysIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Transaction Date
                                            </div>
                                        </label>
                                        <input
                                            id="transaction_date"
                                            type="date"
                                            value={data.transaction_date}
                                            onChange={(e) => setData('transaction_date', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.transaction_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block mb-1 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                                Additional Notes (Optional)
                                            </div>
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="2"
                                            placeholder="Any additional information about your payment"
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
