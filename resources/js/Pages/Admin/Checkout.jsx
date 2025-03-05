// resources/js/Pages/Admin/Checkout.jsx
import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import GuestLayout from "@/Layouts/GuestLayout";
import axios from "axios";
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
    FileText,
    CreditCardIcon,
    Wallet,
    Building,
} from "lucide-react";

export default function Checkout({ auth, bankDetails }) {
    const { cart, clearCart, setCallingCharge } = useCart();
    const cartItems = cart.items;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState("bank_transfer");

    // Calculate totals
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // Use calling charge from cart, or default to 0
    const callingCharge = Number(cart.callingCharge || 0);
    const remainingAmount = subtotal - callingCharge;

    // If we don't have provider info in the cart yet, you might want to set it manually
    // This would be a temporary solution until you have a proper API to fetch this data
    useEffect(() => {
        if (cartItems.length > 0 && !cart.callingCharge) {
            // Get calling charge from the first item if available
            const firstItem = cartItems[0];
            const charge = Number(
                firstItem.provider_calling_charge ||
                    firstItem.provider_info?.calling_charge ||
                    0
            );
            setCallingCharge(charge);
        }
    }, [cartItems]);
    const { data, setData } = useForm({
        items: [],
        booking_date: "",
        booking_time: "",
        address: "",
        phone: "",
        notes: "",
        payment_method: "bank_transfer",
    });

    useEffect(() => {
        setData("items", cartItems);
        setData("payment_method", selectedPaymentMethod);
    }, [cartItems, selectedPaymentMethod]);

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setData("payment_method", method);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/admin/checkout", {
                ...data,
                items: cart.items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
            });

            clearCart();

            // If there's a redirect URL in the response, navigate to it
            if (response.data.redirect_to) {
                window.location.href = response.data.redirect_to;
            } else {
                window.location.href = "/bookings";
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.errors ||
                err.message;
            setError(errorMessage);
            if (err.response?.data?.error_details) {
                console.error(
                    "Error Details:",
                    err.response.data.error_details
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout user={auth.user}>
            <Head title="Checkout" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Cart Summary */}
                            <div>
                                <h2 className="mb-6 text-2xl font-bold">
                                    Order Summary
                                </h2>
                                {cartItems.length === 0 ? (
                                    <div className="py-8 text-center rounded-lg bg-gray-50">
                                        <p className="text-gray-600">
                                            Your cart is empty
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between pb-4 border-b"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                    {item.category && (
                                                        <p className="text-sm text-gray-500">
                                                            {item.category}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="ml-4 text-right">
                                                    <p className="font-bold">
                                                        £
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        £{item.price.toFixed(2)}{" "}
                                                        each
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Provider Information */}
                                        {cart.providerInfo && (
                                            <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
                                                <h4 className="mb-2 font-medium">
                                                    Service Provider
                                                </h4>
                                                <p className="text-gray-700">
                                                    {cart.providerInfo.name}
                                                </p>
                                            </div>
                                        )}

                                        {/* Payment Breakdown */}
                                        <div className="pt-4 space-y-3">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>
                                                    £{subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span className="flex items-center">
                                                    Calling Charge
                                                    <span className="inline-block ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                        Pay Now
                                                    </span>
                                                </span>
                                                <span>
                                                    £{callingCharge.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span className="flex items-center">
                                                    Remaining Balance
                                                    <span className="inline-block ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                        Pay Later
                                                    </span>
                                                </span>
                                                <span>
                                                    £
                                                    {remainingAmount.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-3 font-bold border-t">
                                                <span className="text-lg">
                                                    Total
                                                </span>
                                                <span className="text-xl text-indigo-600">
                                                    £{subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Calling Charge Info */}
                                        <div className="p-4 mt-4 border border-blue-100 rounded-lg bg-blue-50">
                                            <h4 className="mb-2 font-medium text-blue-800">
                                                About Calling Charge
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                A calling charge of £
                                                {callingCharge.toFixed(2)} is
                                                required to confirm your
                                                booking. This is the provider's
                                                initial consultation fee and
                                                will be deducted from your final
                                                payment when the service is
                                                completed.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Booking Form */}
                            <div>
                                <h2 className="mb-6 text-2xl font-bold">
                                    Booking Details
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Booking Date
                                            </div>
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.booking_date}
                                            onChange={(e) =>
                                                setData(
                                                    "booking_date",
                                                    e.target.value
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Booking Time
                                            </div>
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.booking_time}
                                            onChange={(e) =>
                                                setData(
                                                    "booking_time",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Service Address
                                            </div>
                                        </label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your complete service address"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <PhoneIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Contact Phone
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                                Additional Notes
                                            </div>
                                        </label>
                                        <textarea
                                            className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="2"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            placeholder="Any special instructions or requirements (optional)"
                                        />
                                    </div>

                                    {/* Payment Methods */}
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            <div className="flex items-center">
                                                <CreditCardIcon className="w-5 h-5 mr-2 text-gray-500" />
                                                Payment Method
                                            </div>
                                        </label>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                    selectedPaymentMethod ===
                                                    "bank_transfer"
                                                        ? "bg-indigo-50 border-indigo-300"
                                                        : "hover:bg-gray-50"
                                                }`}
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "bank_transfer"
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                        checked={
                                                            selectedPaymentMethod ===
                                                            "bank_transfer"
                                                        }
                                                        onChange={() => {}}
                                                    />
                                                    <div className="ml-3">
                                                        <label className="flex items-center font-medium text-gray-900">
                                                            <Building className="w-5 h-5 mr-2 text-gray-600" />
                                                            Bank Transfer
                                                        </label>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Pay directly to our
                                                            bank account
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                    selectedPaymentMethod ===
                                                    "cash"
                                                        ? "bg-indigo-50 border-indigo-300"
                                                        : "hover:bg-gray-50"
                                                }`}
                                                onClick={() =>
                                                    handlePaymentMethodChange(
                                                        "cash"
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                        checked={
                                                            selectedPaymentMethod ===
                                                            "cash"
                                                        }
                                                        onChange={() => {}}
                                                    />
                                                    <div className="ml-3">
                                                        <label className="flex items-center font-medium text-gray-900">
                                                            <Wallet className="w-5 h-5 mr-2 text-gray-600" />
                                                            Cash Payment
                                                        </label>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Pay in cash to the
                                                            service provider
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 mb-4 border-l-4 border-red-400 bg-red-50">
                                            <div className="flex">
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">
                                                        {typeof error ===
                                                        "object"
                                                            ? Object.values(
                                                                  error
                                                              )
                                                                  .flat()
                                                                  .join(", ")
                                                            : error}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={
                                            loading || cartItems.length === 0
                                        }
                                        className="flex items-center justify-center w-full px-6 py-4 text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                {selectedPaymentMethod ===
                                                "bank_transfer"
                                                    ? "Continue to Bank Transfer"
                                                    : "Place Order"}
                                                <span className="px-2 py-1 ml-2 text-sm bg-white rounded bg-opacity-20">
                                                    Pay £
                                                    {callingCharge.toFixed(2)}{" "}
                                                    Now
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
