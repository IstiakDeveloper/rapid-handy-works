import React, { useState, Fragment, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import SideCart from "@/Components/SideCart";
import MobileNavbar from "@/Components/MobileNavbar";

import {
    Bars3Icon,
    XMarkIcon,
    ShoppingCartIcon,
    UserIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";
import {
    MessageSquare,
    PhoneCall,
    MapPin
} from "lucide-react";

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart } = useCart();

    useEffect(() => {
        console.log("Current Cart State:", cart);
    }, [cart]);

    const navigation = [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "Services", href: "/services", icon: ShoppingCartIcon },
        { name: "About", href: "/about", icon: UserIcon },
        { name: "Contact", href: "/contact", icon: UserIcon },
    ];

    const userNavigation = [
        { name: "Profile", href: "/profile" },
        { name: "Bookings", href: "/bookings" },
        { name: "Settings", href: "/settings" },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Disclosure as="nav" className="bg-white shadow-md">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-20">
                                {/* Logo */}
                                <div className="flex items-center">
                                    <Link href="/" className="flex-shrink-0 flex items-center">
                                        <img
                                            className="h-12 w-auto"
                                            src="/logo.png"
                                            alt="Rapid Handy Works"
                                        />
                                        <span className="ml-3 text-xl font-bold text-amber-500">
                                            Rapid Handy Works
                                        </span>
                                    </Link>
                                </div>

                                {/* Desktop Navigation */}
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                route().current(item.href)
                                                    ? "border-amber-500 text-amber-600"
                                                    : "border-transparent text-gray-500 hover:border-amber-300 hover:text-amber-500",
                                                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Right side actions */}
                                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                                    {/* Cart */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="p-2 rounded-full text-gray-500 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 relative transition-colors duration-200"
                                    >
                                        <ShoppingCartIcon className="h-6 w-6" />
                                        {cart.items.length > 0 && (
                                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-amber-500 rounded-full">
                                                {cart.items.length}
                                            </span>
                                        )}
                                    </button>

                                    {/* User Menu */}
                                    {auth.user ? (
                                        <Menu as="div" className="relative">
                                            <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                                                <img
                                                    className="h-10 w-10 rounded-full border-2 border-amber-500"
                                                    src={auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}&background=f59e0b&color=ffffff`}
                                                    alt={auth.user.name}
                                                />
                                            </Menu.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) => (
                                                                <Link
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        active ? "bg-amber-50" : "",
                                                                        "block px-4 py-2 text-sm text-gray-700 hover:text-amber-600"
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                    <Menu.Item>
                                                        <Link
                                                            method="post"
                                                            href="/logout"
                                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            Logout
                                                        </Link>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center px-4 py-2 border border-amber-500 text-sm font-medium rounded-md text-amber-500 hover:bg-amber-500 hover:text-white transition-colors duration-200"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu */}
                        <Disclosure.Panel className="sm:hidden bg-white border-t">
                            <div className="pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        href={item.href}
                                        className={classNames(
                                            route().current(item.href)
                                                ? "bg-amber-50 text-amber-600"
                                                : "text-gray-500 hover:bg-amber-50 hover:text-amber-600",
                                            "block px-3 py-2 text-base font-medium transition-colors duration-200"
                                        )}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Side Cart */}
            <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Mobile Navigation */}
            <MobileNavbar
                cartItemsCount={cart.items.length}
                onCartClick={() => setIsCartOpen(true)}
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                navigation={navigation}
            />

            {/* Footer */}
            <footer className="bg-gray-100 border-t">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-xl font-bold text-amber-500">
                                Rapid Handy Works
                            </h3>
                            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                                Professional services at your fingertips.
                                Quality, convenience, and reliability - all in one place.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                                Quick Links
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-500 hover:text-amber-500 transition-colors duration-200"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                                Contact Us
                            </h4>
                            <div className="mt-4 space-y-3 text-sm text-gray-600">
                                <p className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-2 text-amber-500" />
                                    support@rapidhandyworks.com
                                </p>
                                <p className="flex items-center">
                                    <PhoneCall className="w-4 h-4 mr-2 text-amber-500" />
                                    +1 (555) 123-4567
                                </p>
                                <p className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                                    123 Service St, Work City
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t text-center">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Rapid Handy Works. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
