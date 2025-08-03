'use client';

import { useState, useMemo } from 'react';
import EventCard from '../events/EventCard'; // Assuming EventCard is in this location
import { addRsvp, removeRsvp } from '../_lib/DataService';

// List of categories to filter by
const allCategories = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Python',
  'Django', 'Flask', 'Java', 'Spring', 'Go', 'PHP', 'Laravel', 'Ruby on Rails',
  'Swift', 'Kotlin', 'React Native', 'Flutter', 'SQL', 'PostgreSQL', 'MySQL',
  'MongoDB', 'Firebase', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'CI/CD', 'Git', 'UI Design', 'UX Design', 'Figma', 'Adobe XD',
  'Project Management', 'Agile', 'Scrum', 'Public Speaking', 'Marketing',
  'Content Writing', 'Graphic Design', 'Leadership', 'Teamwork', 'Problem Solving'
];


export default function SearchClient({ initialEvents, currentUserId, session }) {
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // 'upcoming', 'past'

  // Memoize the filtered events to avoid re-calculating on every render
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter ? event.category?.includes(categoryFilter) : true;

      const eventDate = new Date(event.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date

      let matchesDate = true;
      if (dateFilter === 'upcoming') {
        matchesDate = eventDate >= today;
      } else if (dateFilter === 'past') {
        matchesDate = eventDate < today;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [events, searchQuery, categoryFilter, dateFilter]);

  const handleRsvp = async (eventId) => {
    await addRsvp(eventId, currentUserId);
    // Optimistically update UI
    setEvents(current => current.map(e => e.id === eventId ? {...e, rsvps: [...e.rsvps, {user_id: currentUserId}]} : e));
  };

  const handleCancelRsvp = async (eventId) => {
    await removeRsvp(eventId, currentUserId);
    // Optimistically update UI
    setEvents(current => current.map(e => e.id === eventId ? {...e, rsvps: e.rsvps.filter(r => r.user_id !== currentUserId)} : e));
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Dates</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
      </div>

      {/* Results Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={currentUserId}
              isLoggedIn={!!session}
              onRsvp={handleRsvp}
              onCancelRsvp={handleCancelRsvp}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No events found matching your criteria.
        </p>
      )}
    </div>
  );
}
