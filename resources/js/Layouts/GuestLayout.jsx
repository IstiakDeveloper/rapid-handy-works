import React, { useState, Fragment, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import SideCart from "@/Components/SideCart";
import MobileNavbar from "@/Components/MobileNavbar";
import { motion, AnimatePresence } from "framer-motion";

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
    MapPin,
    ChevronRight,
    Heart,
    Clock,
    Award,
    Shield,
    Send,
    Star,
    CheckCircle,
} from "lucide-react";

export default function EnhancedGuestLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [cart, scrolled]);

    const navigation = [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "Services", href: "/services", icon: ShoppingCartIcon },
        { name: "About", href: "/about", icon: UserIcon },
        { name: "Contact", href: "/contact", icon: Send },
    ];

    const userNavigation = [
        { name: "Profile", href: "/profile", icon: UserIcon },
        { name: "Bookings", href: "/bookings", icon: CheckCircle },
        { name: "Settings", href: "/settings", icon: Star },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    // Enhanced animation variants
    const navbarVariants = {
        initial: {
            height: 90,
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        },
        scrolled: {
            height: 70,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        },
    };

    const cartBadgeVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 600,
                damping: 15,
            },
        },
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Enhanced Navbar */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
                variants={navbarVariants}
                initial="initial"
                animate={scrolled ? "scrolled" : "initial"}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
            >
                <Disclosure as="div" className="relative">
                    {({ open }) => (
                        <>
                            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-24">
                                    {/* Logo with more sophisticated hover effect */}
                                    <div className="flex items-center">
                                        <Link
                                            href="/"
                                            className="flex items-center flex-shrink-0 group"
                                        >
                                            <motion.img
                                                className="w-auto transition-all duration-300 transform h-14 group-hover:scale-105 group-hover:rotate-3"
                                                src="/logo.png"
                                                alt="Rapid Handy Works"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.1,
                                                }}
                                            />
                                        </Link>
                                    </div>

                                    {/* Desktop Navigation with smoother interactions */}
                                    <motion.div
                                        className="items-center hidden sm:ml-6 sm:flex sm:space-x-8"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2,
                                        }}
                                    >
                                        {navigation.map((item, index) => (
                                            <motion.div
                                                key={item.name}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1 * index,
                                                }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        route().current(
                                                            item.href
                                                        )
                                                            ? "text-amber-600 font-semibold"
                                                            : "text-gray-600 hover:text-amber-500",
                                                        "inline-flex items-center text-sm font-medium transition-all duration-300 relative group py-2 px-3 rounded-lg hover:bg-amber-50"
                                                    )}
                                                >
                                                    <item.icon className="w-5 h-5 mr-2 text-gray-400 transition-colors group-hover:text-amber-500" />
                                                    {item.name}
                                                    {route().current(
                                                        item.href
                                                    ) && (
                                                        <motion.span
                                                            layoutId="nav-underline"
                                                            className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-amber-500"
                                                        />
                                                    )}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Right side actions with enhanced interactivity */}
                                    <motion.div
                                        className="hidden space-x-4 sm:ml-6 sm:flex sm:items-center"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.3,
                                        }}
                                    >
                                        {/* Cart with more dynamic badge */}
                                        <motion.button
                                            onClick={() => setIsCartOpen(true)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative p-2.5 text-gray-600 transition-all duration-300 rounded-full hover:bg-amber-50 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                        >
                                            <ShoppingCartIcon className="w-6 h-6" />
                                            <AnimatePresence>
                                                {cart.items.length > 0 && (
                                                    <motion.span
                                                        className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full shadow-md -top-2 -right-2 bg-amber-500"
                                                        variants={
                                                            cartBadgeVariants
                                                        }
                                                        initial="initial"
                                                        animate="animate"
                                                        exit={{
                                                            scale: 0,
                                                            opacity: 0,
                                                        }}
                                                    >
                                                        {cart.items.length}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        {/* User Menu with more elegant dropdown */}
                                        {auth.user ? (
                                            <Menu as="div" className="relative">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                                                    <img
                                                            className="object-cover transition-transform duration-300 border-2 rounded-full w-11 h-11 border-amber-500 hover:rotate-6"
                                                            src={
                                                                auth.user?.avatar
                                                                  ? `/storage/${auth.user.avatar}`
                                                                  : `https://ui-avatars.com/api/?name=${auth.user?.name}&background=f59e0b&color=fff`
                                                              }
                                                            alt={auth.user.name}
                                                        />
                                                    </Menu.Button>
                                                </motion.div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-50 w-64 py-1 mt-3 origin-top-right bg-white shadow-2xl rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="px-4 py-4 bg-amber-50 rounded-t-xl">
                                                            <p className="text-sm font-medium text-gray-600">
                                                                Welcome back,
                                                            </p>
                                                            <p className="text-lg font-bold truncate text-amber-600">
                                                                {auth.user.name}
                                                            </p>
                                                        </div>
                                                        {userNavigation.map(
                                                            (item) => (
                                                                <Menu.Item
                                                                    key={
                                                                        item.name
                                                                    }
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
                                                                                    ? "bg-amber-50 text-amber-600"
                                                                                    : "text-gray-700",
                                                                                "block px-4 py-2.5 text-sm hover:text-amber-600 transition-colors duration-200 flex items-center"
                                                                            )}
                                                                        >
                                                                            <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                                                                            {
                                                                                item.name
                                                                            }
                                                                            {active && (
                                                                                <ChevronRight className="w-4 h-4 ml-auto text-amber-500" />
                                                                            )}
                                                                        </Link>
                                                                    )}
                                                                </Menu.Item>
                                                            )
                                                        )}
                                                        <Menu.Item>
                                                            <Link
                                                                method="post"
                                                                href="/logout"
                                                                className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 border-t"
                                                            >
                                                                Logout
                                                            </Link>
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        ) : (
                                            <div className="flex items-center space-x-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link
                                                        href="/login"
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 border rounded-lg border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white hover:shadow-md"
                                                    >
                                                        Login
                                                    </Link>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link
                                                        href="/register"
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 border border-transparent rounded-lg shadow-sm bg-amber-500 hover:bg-amber-600 hover:shadow-lg"
                                                    >
                                                        Register
                                                    </Link>
                                                </motion.div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Mobile menu with smoother transitions */}
                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Disclosure.Panel className="bg-white border-t sm:hidden">
                                            <div className="pt-2 pb-3 space-y-1">
                                                {navigation.map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as={Link}
                                                        href={item.href}
                                                        className={classNames(
                                                            route().current(
                                                                item.href
                                                            )
                                                                ? "bg-amber-50 text-amber-600 border-l-4 border-amber-500"
                                                                : "text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-l-4 hover:border-amber-300",
                                                            "block px-3 py-3 text-base font-medium transition-all duration-200 pl-4 flex items-center"
                                                        )}
                                                    >
                                                        <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </div>
                                        </Disclosure.Panel>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </Disclosure>
            </motion.nav>

            <main className="container w-full px-4 pb-12 mx-auto pt-28 sm:px-6 lg:px-8">
                <div className="w-full">{children}</div>
            </main>

            {/* Features section before footer */}
            <section className="py-10 bg-gradient-to-r from-gray-50 to-amber-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
                        {[
                            {
                                icon: Clock,
                                title: "Fast Service",
                                description:
                                    "Quick responses to all your service needs",
                            },
                            {
                                icon: Award,
                                title: "Professional Team",
                                description:
                                    "Highly skilled and certified technicians",
                            },
                            {
                                icon: Shield,
                                title: "Satisfaction Guaranteed",
                                description:
                                    "100% money back if you're not satisfied",
                            },
                            {
                                icon: Heart,
                                title: "Customer Care",
                                description:
                                    "Dedicated support team for all your questions",
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-sm hover:shadow-md"
                                whileHover={{ y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full text-amber-500 bg-amber-100">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Side Cart */}
            <SideCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            {/* Mobile Navigation */}
            <MobileNavbar
                cartItemsCount={cart.items.length}
                onCartClick={() => setIsCartOpen(true)}
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                navigation={navigation}
            />

            {/* Footer */}
            <footer className="text-white bg-gray-900">
                <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Company Info */}
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-bold text-amber-400">
                                Rapid Handy Works
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-gray-300">
                                Professional services at your fingertips.
                                Quality, convenience, and reliability - all in
                                one place.
                            </p>
                            <div className="flex mt-6 space-x-4">
                                {[
                                    "facebook",
                                    "twitter",
                                    "instagram",
                                    "linkedin",
                                ].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="text-gray-400 transition-colors duration-300 hover:text-amber-400"
                                    >
                                        <span className="sr-only">
                                            {social}
                                        </span>
                                        <div className="flex items-center justify-center w-8 h-8 p-1 border border-gray-700 rounded-full hover:border-amber-400">
                                            <img
                                                src={`/icons/${social}.png`}
                                                alt={social}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-400">
                                Quick Links
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center text-sm text-gray-300 transition-colors duration-200 hover:text-amber-400 group"
                                        >
                                            <span className="transition-transform duration-200 transform translate-x-0 group-hover:translate-x-1">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-400">
                                Our Services
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {[
                                    "Plumbing",
                                    "Electrical",
                                    "Cleaning",
                                    "Painting",
                                    "Carpentry",
                                ].map((service) => (
                                    <li key={service}>
                                        <Link
                                            href={`/services/${service.toLowerCase()}`}
                                            className="flex items-center text-sm text-gray-300 transition-colors duration-200 hover:text-amber-400 group"
                                        >
                                            <span className="transition-transform duration-200 transform translate-x-0 group-hover:translate-x-1">
                                                {service}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-sm font-semibold tracking-wider uppercase text-amber-400">
                                Contact Us
                            </h4>
                            <div className="mt-4 space-y-3 text-sm text-gray-300">
                                <p className="flex items-center group">
                                    <MessageSquare className="w-4 h-4 mr-2 transition-transform duration-200 text-amber-400 group-hover:scale-110" />
                                    <span className="transition-colors duration-200 group-hover:text-amber-400">
                                        support@rapidhandyworks.com
                                    </span>
                                </p>
                                <p className="flex items-center group">
                                    <PhoneCall className="w-4 h-4 mr-2 transition-transform duration-200 text-amber-400 group-hover:scale-110" />
                                    <span className="transition-colors duration-200 group-hover:text-amber-400">
                                        +1 (555) 123-4567
                                    </span>
                                </p>
                                <p className="flex items-center group">
                                    <MapPin className="w-4 h-4 mr-2 transition-transform duration-200 text-amber-400 group-hover:scale-110" />
                                    <span className="transition-colors duration-200 group-hover:text-amber-400">
                                        123 Service St, Work City
                                    </span>
                                </p>
                            </div>
                            <div className="mt-6">
                                <h5 className="mb-2 text-sm font-medium text-amber-400">
                                    Subscribe to our newsletter
                                </h5>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                    <button className="px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-amber-500 rounded-r-md hover:bg-amber-600">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px my-8 bg-gray-800"></div>

                    {/* Copyright and Bottom Links */}
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Rapid Handy Works.
                            All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link
                                href="/privacy"
                                className="text-sm text-gray-400 transition-colors duration-200 hover:text-amber-400"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-gray-400 transition-colors duration-200 hover:text-amber-400"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/faq"
                                className="text-sm text-gray-400 transition-colors duration-200 hover:text-amber-400"
                            >
                                FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
