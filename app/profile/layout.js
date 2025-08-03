'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { signOutAction } from '../_lib/actions';
import { useEffect, useState } from 'react';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: '/profile/show', icon: UserCircleIcon, title: 'My Profile' },
    { href: '/profile/update', icon: Cog6ToothIcon, title: 'Update Profile' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-screen z-40 w-16 sm:w-20 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-4 space-y-6 sm:space-y-8 border-r border-gray-300 dark:border-gray-700">
        {links.map(({ href, icon: Icon, title }) => (
          <Link key={href} href={href} title={title}>
            <div
              className={`p-2 rounded-full hover:shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                pathname === href
                  ? 'bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </Link>
        ))}

        {/* Sign Out Button */}
        <form action={signOutAction} className="mt-auto mb-4">
          <button
            title="Sign Out"
            className="p-2 rounded-full text-red-500 hover:shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 text-black dark:text-white ml-20 mt-16">
        {mounted && children}
      </main>
    </div>
  );
}
