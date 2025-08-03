'use client';

import { useState, useEffect, useRef } from 'react';
import { createEvent } from '../_lib/DataService';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Re-using the same list for consistency across the app
const allCategories = [
  // Technical Skills
  'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Python',
  'Django', 'Flask', 'Java', 'Spring', 'Go', 'PHP', 'Laravel', 'Ruby on Rails',
  'Swift', 'Kotlin', 'React Native', 'Flutter', 'SQL', 'PostgreSQL', 'MySQL',
  'MongoDB', 'Firebase', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'CI/CD', 'Git', 'UI Design', 'UX Design', 'Figma', 'Adobe XD',
  // Other Skills
  'Project Management', 'Agile', 'Scrum', 'Public Speaking', 'Marketing',
  'Content Writing', 'Graphic Design', 'Leadership', 'Teamwork', 'Problem Solving'
];

export default function CreateEventForm({ userId, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // State for the category dropdown
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableCategories = allCategories
    .filter(cat => !selectedCategories.includes(cat))
    .filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectCategory = (category) => {
    setSelectedCategories([...selectedCategories, category]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.target);
    const eventData = {
      title: formData.get('title'),
      description: formData.get('description'),
      event_date: formData.get('event_date'),
      location: formData.get('location'),
      // Manually set the category from our state
      category: selectedCategories.join(', '),
      created_by: userId,
    };

    if (!eventData.title || !eventData.event_date || !eventData.location) {
      setError('Title, Date, and Location are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await createEvent(eventData);
      // On success, call the callback to close the modal
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title, Description, Date, Location fields (unchanged) */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Event Title</label>
        <input type="text" id="title" name="title" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea id="description" name="description" rows="4" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>
      <div>
        <label htmlFor="event_date" className="block text-sm font-medium">Date</label>
        <input type="date" id="event_date" name="event_date" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <input type="text" id="location" name="location" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="category-search" className="block text-sm font-medium">
          Category / Skills
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2 min-h-[42px]">
            {selectedCategories.map(cat => (
              <span key={cat} className="flex items-center gap-1 bg-indigo-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                {cat}
                <button type="button" onClick={() => handleRemoveCategory(cat)} className="text-indigo-100 hover:text-white">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
            <input
              id="category-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={selectedCategories.length === 0 ? "Select relevant categories..." : ""}
              className="flex-grow bg-transparent focus:outline-none"
            />
          </div>
          {isDropdownOpen && availableCategories.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableCategories.map(cat => (
                <li
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-700"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}
