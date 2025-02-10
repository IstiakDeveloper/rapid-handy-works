import React from 'react';
import { Link } from '@inertiajs/react';
import {
  HomeIcon,
  ShoppingCartIcon,
  Bars3Icon,
  UserIcon
} from '@heroicons/react/24/outline';

const MobileNavbar = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  return (
    <div className="sm:hidden fixed bottom-0 w-full bg-white shadow-inner z-50 py-2">
      <div className="flex justify-around">
        <Link href="/">
          <HomeIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <button onClick={onCartClick} className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartItemsCount}
            </span>
          )}
        </button>
        <Link href="/profile">
          <UserIcon className="h-6 w-6 text-gray-600" />
        </Link>
        <button onClick={onMenuClick}>
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MobileNavbar;
