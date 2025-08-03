'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../_lib/supabase';
import { getUserData, addRsvp, removeRsvp } from '../_lib/DataService';
import EventCard from './EventCard';

export default function EventsClient({ initialEvents, userId, session }) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const eventsChannel = supabase
      .channel('realtime-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        async (payload) => {
          const newEvent = payload.new;
          const creatorData = await getUserData(newEvent.created_by);
          const creatorName = creatorData?.[0]?.name || 'Anonymous';
          const enrichedEvent = { ...newEvent, creatorName, rsvps: [] };
          setEvents((current) => [...current, enrichedEvent]);
        }
      )
      .subscribe();

    const rsvpsChannel = supabase
      .channel('realtime-rsvps')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rsvps' },
        (payload) => {
          setEvents((currentEvents) =>
            currentEvents.map((event) => {
              if (payload.eventType === 'INSERT' && payload.new.event_id === event.id) {
                // Avoid duplicating the optimistic update if the user who RSVP'd is the current user
                if (payload.new.user_id === userId) return event;
                return { ...event, rsvps: [...event.rsvps, payload.new] };
              }
              if (payload.eventType === 'DELETE' && payload.old.event_id === event.id) {
                 if (payload.old.user_id === userId) return event;
                return {
                  ...event,
                  rsvps: event.rsvps.filter((rsvp) => rsvp.user_id !== payload.old.user_id),
                };
              }
              return event;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(rsvpsChannel);
    };
  }, [userId]);


  const handleRsvp = async (eventId) => {
    // 1. Optimistically update the UI
    setEvents(currentEvents =>
      currentEvents.map(event => {
        if (event.id === eventId) {
          const newRsvp = { user_id: userId, event_id: eventId };
          return { ...event, rsvps: [...event.rsvps, newRsvp] };
        }
        return event;
      })
    );

    // 2. Call the database in the background
    try {
      await addRsvp(eventId, userId);
    } catch (error) {
      // If it fails, revert the change and show an error
      console.error("Failed to RSVP:", error);
      alert("Error: Could not RSVP for the event.");
      setEvents(initialEvents); // Revert to original state on error
    }
  };

  const handleCancelRsvp = async (eventId) => {
    // 1. Optimistically update the UI
    setEvents(currentEvents =>
      currentEvents.map(event => {
        if (event.id === eventId) {
          return { ...event, rsvps: event.rsvps.filter(r => r.user_id !== userId) };
        }
        return event;
      })
    );

    // 2. Call the database in the background
    try {
      await removeRsvp(eventId, userId);
    } catch (error) {
      console.error("Failed to cancel RSVP:", error);
      alert("Error: Could not cancel your RSVP.");
      setEvents(initialEvents); // Revert to original state on error
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          currentUserId={userId}
          isLoggedIn={!!session}
          onRsvp={handleRsvp}
          onCancelRsvp={handleCancelRsvp}
        />
      ))}
    </div>
  );
}
