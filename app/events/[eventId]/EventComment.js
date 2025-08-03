'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase';
import { addComment } from '@/app/_lib/DataService';

function formatTimeAgo(dateString) {
    // ... (same formatTimeAgo function from EventCard)
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

export default function EventComments({ eventId, initialComments, userId, isLoggedIn, session }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`comments-for-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `event_id=eq.${eventId}` },
        (payload) => {
           // To avoid re-fetching, we assume the user's name is available from the session or a passed prop
           // For simplicity here, we just add the new comment. A better approach would be to fetch the user name.
          setComments((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const addedComment = await addComment(eventId, userId, newComment);
      // Optimistically add the comment to the UI
      setComments((current) => [addedComment, ...current]);
      setNewComment('');
    } catch (error) {
      alert('Failed to post comment.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>

      {/* Comment Form */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
              src={session.user.image}
              alt="User Avatar"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:border-indigo-700 transition cursor-pointer object-cover"
            />
            </div>
            <div>
              <div className="text-sm">
                <span className="font-bold">{comment.users?.name || 'Anonymous'}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  {formatTimeAgo(comment.created_at)}
                </span>
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
