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
    LayersIcon,
    ShieldIcon,
    UserCircleIcon
} from "lucide-react";

export default function Authenticated({ children }) {
    const { auth, notifications } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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

    useEffect(() => {
        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
            if (isNotificationsOpen && !event.target.closest('.notifications-container')) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen, isNotificationsOpen]);

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
            // { name: "Reports", href: "/admin/reports", icon: FileTextIcon },
            // { name: "Settings", href: "/admin/settings", icon: Settings2Icon },
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
            // { name: "Reviews", href: "/provider/reviews", icon: StarIcon },
            // { name: "Messages", href: "/provider/messages", icon: MessageSquareIcon },
            // { name: "Earnings", href: "/provider/earnings", icon: DollarSignIcon },
        ],
        client: [
            { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
            { name: "Book Service", href: "/services", icon: WrenchIcon },
            {
                name: "My Bookings",
                href: "/bookings",
                icon: CalendarDaysIcon,
            },
            // { name: "My Reviews", href: "/reviews", icon: StarIcon },
            // { name: "Favorites", href: "/favorites", icon: StarIcon },
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

    // Role badge styling helper
    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'provider':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    // Convert role to display format
    const formatRole = (role) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

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
                        <div className="flex items-center justify-between h-16 px-4 border-b bg-amber-50">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <WrenchIcon className="w-8 h-8 text-amber-600" />
                                <span className="text-xl font-bold text-gray-900">
                                    Rapid Handy Work
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

                        {/* User Profile Summary */}
                        <div className="p-4 border-b bg-white">
                            <div className="flex items-center space-x-3">
                                <img
                                   src={
                                    auth.user?.avatar
                                      ? `/storage/${auth.user.avatar}`
                                      : `https://ui-avatars.com/api/?name=${auth.user?.name}&background=f59e0b&color=fff`
                                  }
                                    alt={auth.user?.name}
                                    className="w-10 h-10 rounded-full border-2 border-amber-300"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {auth.user?.name}
                                    </p>
                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeStyle(userRole)}`}>
                                        {formatRole(userRole)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                            {currentNavigation.map((item) => {
                                const Icon = item.icon;
                                const isCurrentRoute = window.location.pathname === item.href ||
                                    window.location.pathname.startsWith(item.href + '/');
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isMenuOpen = openMenus[item.name];

                                return (
                                    <div key={item.name} className="mb-1">
                                        <div
                                            className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                                                isCurrentRoute
                                                    ? "bg-amber-50 text-amber-800"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center flex-1"
                                            >
                                                <Icon className={`w-5 h-5 mr-3 ${isCurrentRoute ? 'text-amber-600' : 'text-gray-500'}`} />
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
                                                {item.subItems.map((subItem) => {
                                                    const isSubItemActive = window.location.pathname === subItem.href ||
                                                        window.location.pathname.startsWith(subItem.href + '/');

                                                    return (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                                                isSubItemActive
                                                                    ? "text-amber-800 bg-amber-50"
                                                                    : "text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Help Section */}
                        <div className="p-4 border-t">
                            <Link
                                href="/help"
                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                            >
                                <HelpCircleIcon className="w-5 h-5 mr-3 text-gray-500" />
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

                            {/* Page Title - Would be dynamic in a real app */}
                            <div className="hidden md:block">
                                <h1 className="text-xl font-semibold text-gray-800">
                                    {/* Dynamic page title would go here */}
                                    Dashboard
                                </h1>
                            </div>

                            {/* Right side buttons */}
                            <div className="flex items-center space-x-4 ml-auto">
                                {/* Notifications */}
                                <div className="relative notifications-container">
                                    <button
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className="p-1 text-gray-600 rounded-full hover:bg-gray-100 relative"
                                    >
                                        <BellIcon className="w-6 h-6" />
                                        {notifications?.unread_count > 0 && (
                                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                                {notifications?.unread_count}
                                            </span>
                                        )}
                                    </button>

                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                            </div>

                                            {/* Sample notifications - would be dynamic in real app */}
                                            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">New booking request</p>
                                                <p className="text-xs text-gray-500 mt-1">A new booking has been requested for your service</p>
                                                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                            </div>

                                            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 bg-amber-50">
                                                <p className="text-sm font-medium text-gray-900">Payment received</p>
                                                <p className="text-xs text-gray-500 mt-1">You received a payment of $120.00</p>
                                                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                                            </div>

                                            <div className="px-4 py-2 text-center">
                                                <Link href="/notifications" className="text-xs font-medium text-amber-600 hover:text-amber-500">
                                                    View all notifications
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative profile-dropdown-container">
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center space-x-2 text-sm focus:outline-none p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <img
                                            src={
                                                auth.user?.avatar
                                                  ? `/storage/${auth.user.avatar}`
                                                  : `https://ui-avatars.com/api/?name=${auth.user?.name}&background=f59e0b&color=fff`
                                              }
                                            alt={auth.user?.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="hidden md:block text-left">
                                            <span className="block font-medium text-gray-700 leading-tight">
                                                {auth.user?.name}
                                            </span>
                                            <span className="block text-xs text-gray-500 mt-0.5">
                                                {formatRole(userRole)}
                                            </span>
                                        </div>
                                        <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                                                <p className="text-sm font-medium text-gray-900">{auth.user?.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{auth.user?.email}</p>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeStyle(userRole)}`}>
                                                        {formatRole(userRole)}
                                                    </span>
                                                </div>
                                            </div>

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
                            <div className="flex flex-col md:flex-row md:justify-between items-center">
                                <p className="text-sm text-gray-500">
                                    &copy; {new Date().getFullYear()} Rapid Handy Work. All rights reserved.
                                </p>
                                <div className="flex mt-3 md:mt-0 space-x-6">
                                    <Link href="/terms" className="text-xs text-gray-500 hover:text-amber-600">Terms of Service</Link>
                                    <Link href="/privacy" className="text-xs text-gray-500 hover:text-amber-600">Privacy Policy</Link>
                                    <Link href="/contact" className="text-xs text-gray-500 hover:text-amber-600">Contact Us</Link>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
