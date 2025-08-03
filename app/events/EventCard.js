'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/solid';

// A simple utility to format time nicely, e.g., "5 minutes ago"
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}

export default function EventCard({
  event,
  currentUserId,
  isLoggedIn,
  onRsvp,
  onCancelRsvp,
  isDetailsPage = false, // Prop to disable the link
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Safely access rsvps, defaulting to an empty array
  const rsvpCount = event.rsvps?.length || 0;
  const isUserRsvpd = event.rsvps?.some(rsvp => rsvp.user_id === currentUserId);

  const handleRsvpClick = async () => {
    if (!isLoggedIn) {
      alert('Please log in to RSVP.');
      return;
    }
    setIsLoading(true);
    await onRsvp(event.id);
    setIsLoading(false);
  };

  const handleCancelClick = async () => {
    setIsLoading(true);
    await onCancelRsvp(event.id);
    setIsLoading(false);
  };

  // The main JSX for the card's content
  const CardContent = (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Main content area */}
      <div className="flex-grow">
        {event.category && (
          <div className="flex flex-wrap gap-1 mb-2">
            {event.category.split(',').map(cat => (
              <span key={cat.trim()} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                {cat.trim()}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{event.title}</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">{event.description}</p>
      </div>

      {/* Details section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
        <p><strong>📍 Location:</strong> {event.location}</p>
        <p><strong>🗓️ Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Created by <strong>{event.creatorName || 'Anonymous'}</strong>
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          {formatTimeAgo(event.created_at)}
        </p>
      </div>

      {/* RSVP section (only show if not on details page) */}
      {!isDetailsPage && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <UserGroupIcon className="w-5 h-5 mr-2" />
            <span className="font-bold">{rsvpCount}</span>
            <span className="ml-1">attending</span>
          </div>

          {isLoggedIn && (
            isUserRsvpd ? (
              <button
                onClick={handleCancelClick}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
              >
                {isLoading ? 'Cancelling...' : 'Cancel RSVP'}
              </button>
            ) : (
              <button
                onClick={handleRsvpClick}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
              >
                {isLoading ? 'RSVPing...' : 'RSVP'}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );

  // If it's the details page, just render the content without a link
  if (isDetailsPage) {
    return CardContent;
  }

  // Otherwise, wrap the content in a link to the event's details page
  return (
    <Link href={`/events/${event.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg h-full">
      {CardContent}
    </Link>
  );
}
