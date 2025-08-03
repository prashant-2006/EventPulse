'use client';

import { useState, useEffect, useRef } from 'react';
import { updateProfileAction } from '../../_lib/actions';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Comprehensive list of skills
const allSkills = [
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

export default function UpdateProfileForm({ userData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for the multi-select dropdown
  const [selectedSkills, setSelectedSkills] = useState(
    userData?.skills ? userData.skills.split(',').map(s => s.trim()) : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { name, bio } = userData;

  // Filter skills that are not yet selected and match the search term
  const availableSkills = allSkills
    .filter(skill => !selectedSkills.includes(skill))
    .filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectSkill = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setSearchTerm(''); // Reset search term after selection
    setIsDropdownOpen(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.target);
    // Manually set the skills value from our state
    formData.set('skills', selectedSkills.join(', '));

    try {
      const result = await updateProfileAction(formData);
      if (result?.error) {
        throw new Error(result.error);
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
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
      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={name}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          rows="3"
          placeholder="Tell us a little about yourself"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      {/* Skills/Interests Dropdown */}
      <div>
        <label htmlFor="skills-search" className="block text-sm font-medium">
          Skills / Interests
        </label>
        <div className="relative" ref={dropdownRef}>
          {/* Display selected skills as badges */}
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2 min-h-[42px]">
            {selectedSkills.map(skill => (
              <span key={skill} className="flex items-center gap-1 bg-indigo-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-100 hover:text-white">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
            {/* Search input */}
            <input
              id="skills-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={selectedSkills.length === 0 ? "Select your skills..." : ""}
              className="flex-grow bg-transparent focus:outline-none"
            />
          </div>

          {/* Dropdown list */}
          {isDropdownOpen && availableSkills.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableSkills.map(skill => (
                <li
                  key={skill}
                  onClick={() => handleSelectSkill(skill)}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-700"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
