'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Navbar({ session }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Updated links for the events website
  const links = [
    { href: '/events', icon: CalendarDaysIcon, label: 'Events' },
    { href: '/search', icon: MagnifyingGlassIcon, label: 'Search' },
    { href: '/create', icon: PlusCircleIcon, label: 'Create Event' },
  ];

  const activeClasses =
    'bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white text-black dark:bg-gray-800 dark:text-white shadow-md border-b border-gray-300 dark:border-gray-700">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500 text-white">
          <CalendarDaysIcon className="w-8 h-8" />
        </div>
        <span className="text-3xl font-bold hidden sm:inline">EventPulse</span>
      </Link>

      {/* Links & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} title={label}>
            <div
              className={`p-2 rounded-full transition hover:shadow-md hover:bg-gray-200 dark:hover:bg-indigo-900 ${
                pathname === href
                  ? activeClasses
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </Link>
        ))}

        {/* Profile / User Icon */}
        <Link href="/profile" title="Profile">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="User Avatar"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:border-indigo-700 transition cursor-pointer object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-gray-600 dark:text-gray-300 cursor-pointer p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-indigo-900 transition" />
          )}
        </Link>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full transition hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-600 dark:text-gray-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-indigo-500" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
}