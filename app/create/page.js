import { getUserData } from '../_lib/DataService';
import { redirect } from 'next/navigation';
import CreateEventForm from './CreateEventForm';
import { auth } from '../_lib/auth';

export default async function CreateEventPage() {
  // 1. Get user session
  const session = await auth();
  if (!session?.user?.email) {
    // Redirect to login if not authenticated
    redirect('/login');
  }

  const email = session.user.email;

  if (!email) {
    // Handle case where user data couldn't be found
    return <p>Error: Could not find your user profile.</p>;
  }

  // 3. Pass the user's ID to the client form component
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Event</h1>
      <CreateEventForm email={email} />
    </div>
  );
}