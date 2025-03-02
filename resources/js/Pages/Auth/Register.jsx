// resources/js/Pages/Auth/Register.jsx
import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    WrenchIcon,
    UserIcon,
    MailIcon,
    KeyIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    UserPlusIcon,
} from "lucide-react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Register() {
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        password_confirmation: "",
        role: "client", // Default role
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    // Check email availability
    const checkEmail = async (email) => {
        if (!email) return;

        setCheckingEmail(true);
        try {
            const response = await axios.post(route("check.email"), { email });
            setEmailAvailable(!response.data.exists);
        } catch (error) {
            console.error("Error checking email:", error);
        } finally {
            setCheckingEmail(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 sm:px-6 lg:px-8">
                <Head title="Register" />

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center">
                            <WrenchIcon className="h-12 w-12 text-indigo-600" />
                        </Link>
                    </div>

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already registered?{" "}
                        <Link
                            href={route("login")}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in to your account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData("email", e.target.value);
                                            checkEmail(e.target.value);
                                        }}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your email"
                                    />
                                    {checkingEmail && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg
                                                className="animate-spin h-5 w-5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                                {!emailAvailable && (
                                    <p className="mt-2 text-sm text-red-600">
                                        This email is already taken.
                                    </p>
                                )}
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone Number
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="+880"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Address Input */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your address"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Register as
                                </label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("role", "client")
                                        }
                                        className={`${
                                            data.role === "client"
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                                : "bg-white border-gray-300 text-gray-700"
                                        } flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                        <UserIcon className="h-5 w-5 mr-2" />
                                        Client
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("role", "provider")
                                        }
                                        className={`${
                                            data.role === "provider"
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                                                : "bg-white border-gray-300 text-gray-700"
                                        } flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                        <BriefcaseIcon className="h-5 w-5 mr-2" />
                                        Service Provider
                                    </button>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Create a password"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing || !emailAvailable}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    <UserPlusIcon className="h-5 w-5 mr-2" />
                                    {processing
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>
                            </div>
                        </form>

                        {/* Terms and Privacy Policy */}
                        <div className="mt-6">
                            <p className="text-xs text-center text-gray-600">
                                By creating an account, you agree to our{" "}
                                <Link
                                    href="/terms"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
