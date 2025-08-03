// app/events/page.jsx
import { Suspense } from 'react';
import { getEvents, getUserData, getRsvpsForEvent } from '../_lib/DataService';
import { auth } from '../_lib/auth';
import LoadingSpinner from '../loading';
import EventsClient from './EventsClient';

export const revalidate = 0;

export default async function EventsPage() {
  const session = await auth();
  const initialEventsRaw = await getEvents();

  // Enrich events with creator names and RSVP data
  const initialEvents = await Promise.all(
    initialEventsRaw.map(async (event) => {
      // Fetch creator name
      const creatorData = event.created_by ? await getUserData(event.created_by) : null;
      const creatorName = creatorData?.[0]?.name || 'Anonymous';

      // Fetch initial RSVPs for this event
      const rsvps = await getRsvpsForEvent(event.id);

      return { ...event, creatorName, rsvps };
    })
  );

  const userData = session ? await getUserData(session.user.email) : null;
  const userId = userData?.[0]?.id;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mt-4 mb-2">Community Events</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <EventsClient
          initialEvents={initialEvents}
          userId={userId} // Pass current user's ID
          session={session} // Pass session to know if user is logged in
        />
      </Suspense>
    </div>
  );
}
