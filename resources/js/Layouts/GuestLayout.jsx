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

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Use the cart context
    const { cart } = useCart();

    // Log cart state whenever it changes
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
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Disclosure as="nav" className="bg-white shadow-md">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                {/* Logo */}
                                <div className="flex items-center">
                                    <Link
                                        href="/"
                                        className="flex-shrink-0 flex items-center"
                                    >
                                        <img
                                            className="h-10 w-auto"
                                            src="/logo.png" // Replace with your logo
                                            alt="Rapid Handy Works"
                                        />
                                        <span className="ml-2 text-xl font-bold text-gray-800">

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
                                                    ? "border-indigo-500 text-gray-900"
                                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Right side actions */}
                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    {/* Cart */}
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                                    >
                                        <ShoppingCartIcon className="h-6 w-6" />
                                        {cart.items.length > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                {cart.items.length}
                                            </span>
                                        )}
                                    </button>

                                    {/* User Menu */}
                                    {auth.user ? (
                                        <Menu
                                            as="div"
                                            className="ml-3 relative"
                                        >
                                            <div>
                                                <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    <span className="sr-only">
                                                        Open user menu
                                                    </span>
                                                    <img
                                                        className="h-8 w-8 rounded-full"
                                                        src={
                                                            auth.user.avatar ||
                                                            `https://ui-avatars.com/api/?name=${auth.user.name}`
                                                        }
                                                        alt={auth.user.name}
                                                    />
                                                </Menu.Button>
                                            </div>
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
                                                    {userNavigation.map(
                                                        (item) => (
                                                            <Menu.Item
                                                                key={item.name}
                                                            >
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        className={classNames(
                                                                            active
                                                                                ? "bg-gray-100"
                                                                                : "",
                                                                            "block px-4 py-2 text-sm text-gray-700"
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                        )
                                                    )}
                                                    <Menu.Item>
                                                        <Link
                                                            method="post"
                                                            href="/logout"
                                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            Logout
                                                        </Link>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        <div className="ml-3 flex items-center space-x-2">
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu */}
                        <Disclosure.Panel className="sm:hidden">
                            <div className="pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        href={item.href}
                                        className={classNames(
                                            route().current(item.href)
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
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

            {/* Page content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {children}
            </main>

            <SideCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <MobileNavbar
                cartItemsCount={cart.items.length}
                onCartClick={() => setIsCartOpen(true)}
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                navigation={navigation}
            />

            {/* Footer */}
            <footer className="bg-white mt-8 border-t">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Rapid Handy Works
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Professional services at your fingertips.
                                Quality, convenience, and reliability.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Quick Links
                            </h4>
                            <ul className="mt-4 space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Contact
                            </h4>
                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                <p>Email: support@rapidhandyworks.com</p>
                                <p>Phone: +1 (555) 123-4567</p>
                                <p>Address: 123 Service St, Work City</p>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 border-t pt-6 text-center">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Rapid Handy Works.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
