import { getEvents, getCommentsForEvent } from '@/app/_lib/DataService';
import { getUserData } from '@/app/_lib/DataService';
import EventComments from './EventComment';
import EventCard from '../EventCard';
import { auth } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => ({ eventId: String(event.id) }));
}

export default async function EventDetailsPage({ params }) {
  const session = await auth();
  const eventId = Number(params.eventId);
  const userData = session ? await getUserData(session.user.email) : null;
  const userId = userData?.[0]?.id;

  // Fetch a single event
  const { data: event } = await supabase.from('events').select('*, users (name)').eq('id', eventId).single();
  const initialComments = await getCommentsForEvent(eventId);

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
        {/* We can reuse the EventCard to display the main details */}
        {/* You might want to create a more detailed component later */}
        <div className="mb-8 mt-8">
             <EventCard event={event} currentUserId={session?.user.id} isLoggedIn={!!session} isDetailsPage={true} />
        </div>

        {/* Comments Section */}
        <EventComments
            eventId={eventId}
            initialComments={initialComments}
            userId={userId}
            isLoggedIn={!!session}
            session={session}
        />
    </div>
  );
}
