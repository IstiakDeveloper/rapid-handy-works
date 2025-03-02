import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    HomeIcon,
    CalendarDaysIcon,
    Settings2Icon,
    UserIcon,
    BellIcon,
    LogOutIcon,
    MenuIcon,
    XIcon,
    WrenchIcon,
    UsersIcon,
    FileTextIcon,
    StarIcon,
    HelpCircleIcon,
    ChevronDownIcon,
    BriefcaseIcon,
    MessageSquareIcon,
    DollarSignIcon,
    LayersIcon
} from "lucide-react";

export default function Authenticated({ children }) {
    const { auth, notifications } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Navigation structure with dropdown capabilities
    const navigation = {
        admin: [
            { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
            {
                name: "Users",
                href: "/admin/users",
                icon: UsersIcon,
            },
            {
                name: "Services",
                href: "/admin/services",
                icon: WrenchIcon,
            },
            {
                name: "Bookings",
                href: "/admin/bookings",
                icon: CalendarDaysIcon,
            },
            { name: "Reports", href: "/admin/reports", icon: FileTextIcon },
            { name: "Settings", href: "/admin/settings", icon: Settings2Icon },
        ],
        provider: [
            { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
            {
                name: "My Services",
                href: "/admin/services",
                icon: WrenchIcon,
            },
            {
                name: "Bookings",
                href: "/provider/bookings",
                icon: CalendarDaysIcon,
            },
            { name: "Reviews", href: "/provider/reviews", icon: StarIcon },
            { name: "Messages", href: "/provider/messages", icon: MessageSquareIcon },
            { name: "Earnings", href: "/provider/earnings", icon: DollarSignIcon },
        ],
        client: [
            { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
            { name: "Book Service", href: "/", icon: WrenchIcon },
            {
                name: "My Bookings",
                href: "/bookings",
                icon: CalendarDaysIcon,
            },
            { name: "My Reviews", href: "/reviews", icon: StarIcon },
            { name: "Favorites", href: "/favorites", icon: StarIcon },
        ],
    };

    // Dropdown menus for each role
    const dropdownMenus = {
        admin: [
            { name: "Profile", href: "/profile", icon: UserIcon },
            { name: "User Management", href: "/admin/users", icon: UsersIcon },
            { name: "System Settings", href: "/admin/settings", icon: Settings2Icon },
            {
                name: "Logout",
                href: "/logout",
                icon: LogOutIcon,
                method: "post",
                as: "button",
                className: "w-full text-red-600"
            }
        ],
        provider: [
            { name: "Profile", href: "/profile", icon: UserIcon },
            { name: "Business Profile", href: "/provider/business", icon: BriefcaseIcon },
            { name: "Account Settings", href: "/settings", icon: Settings2Icon },
            {
                name: "Logout",
                href: "/logout",
                icon: LogOutIcon,
                method: "post",
                as: "button",
                className: "w-full text-red-600"
            }
        ],
        client: [
            { name: "Profile", href: "/profile", icon: UserIcon },
            { name: "My Addresses", href: "/addresses", icon: LayersIcon },
            { name: "Account Settings", href: "/settings", icon: Settings2Icon },
            {
                name: "Logout",
                href: "/logout",
                icon: LogOutIcon,
                method: "post",
                as: "button",
                className: "w-full text-red-600"
            }
        ]
    };

    // Toggle menu open/closed
    const toggleMenu = (menuName) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const userRole = auth.user?.role || "client";
    const currentNavigation = navigation[userRole];
    const currentDropdownMenu = dropdownMenus[userRole];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="flex items-center justify-between h-16 px-4 border-b">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <WrenchIcon className="w-8 h-8 text-indigo-600" />
                                <span className="text-xl font-bold text-gray-900">
                                    Rapid Handy Works
                                </span>
                            </Link>
                            {isMobile && (
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="lg:hidden"
                                >
                                    <XIcon className="w-6 h-6 text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                            <div className="py-4">
                                {currentNavigation.map((item) => {
                                    const Icon = item.icon;
                                    const isCurrentRoute = route().current(item.href);
                                    const hasSubItems = item.subItems && item.subItems.length > 0;
                                    const isMenuOpen = openMenus[item.name];

                                    return (
                                        <div key={item.name} className="mb-1">
                                            <div
                                                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg ${
                                                    isCurrentRoute
                                                        ? "bg-indigo-50 text-indigo-600"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center flex-1"
                                                >
                                                    <Icon className="w-5 h-5 mr-3" />
                                                    {item.name}
                                                </Link>
                                                {hasSubItems && (
                                                    <button
                                                        onClick={() => toggleMenu(item.name)}
                                                        className="ml-2 focus:outline-none"
                                                    >
                                                        <ChevronDownIcon
                                                            className={`w-4 h-4 transform transition-transform ${
                                                                isMenuOpen ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </button>
                                                )}
                                            </div>

                                            {hasSubItems && isMenuOpen && (
                                                <div className="ml-8 space-y-1 mt-1">
                                                    {item.subItems.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                                                                route().current(subItem.href)
                                                                    ? "text-indigo-600 bg-indigo-50"
                                                                    : "text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Help Section */}
                        <div className="p-4 border-t">
                            <Link
                                href="/help"
                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                <HelpCircleIcon className="w-5 h-5 mr-3" />
                                Help Center
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Navigation */}
                    <header className="bg-white shadow-sm">
                        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                            {/* Mobile menu button */}
                            {isMobile && (
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="text-gray-600 lg:hidden"
                                >
                                    <MenuIcon className="w-6 h-6" />
                                </button>
                            )}

                            {/* Right side buttons */}
                            <div className="flex items-center space-x-4 ml-auto">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        className="p-1 text-gray-600 rounded-full hover:bg-gray-100 relative"
                                    >
                                        <BellIcon className="w-6 h-6" />
                                        {notifications?.unread_count > 0 && (
                                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center space-x-2 text-sm focus:outline-none"
                                    >
                                        <img
                                            src={
                                                auth.user?.avatar ||
                                                `https://ui-avatars.com/api/?name=${auth.user?.name}`
                                            }
                                            alt={auth.user?.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="hidden md:inline-block font-medium text-gray-700">
                                            {auth.user?.name}
                                        </span>
                                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                                            {currentDropdownMenu.map((item) => {
                                                const ItemIcon = item.icon;

                                                // Render as Link for most items
                                                if (!item.method) {
                                                    return (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${item.className || ''}`}
                                                        >
                                                            <ItemIcon className="w-4 h-4 mr-3" />
                                                            {item.name}
                                                        </Link>
                                                    );
                                                }

                                                // Render as button for special actions like logout
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        method={item.method}
                                                        as={item.as || 'link'}
                                                        className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${item.className || ''}`}
                                                    >
                                                        <ItemIcon className="w-4 h-4 mr-3" />
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="bg-white border-t">
                        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <p className="text-sm text-center text-gray-500">
                                &copy; {new Date().getFullYear()} Rapid Handy Works. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
