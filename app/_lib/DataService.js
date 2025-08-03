import { supabase } from "./supabase";

export async function getUser(email){
   let { data, error } = await supabase
  .from('users')
  .select('id')
  .eq('email', email)
  .limit(1);

    if (error) {
        console.error(error);
        throw new Error('Error fetching user');
    }
    return data?.[0] || null;
}

export async function createUser({ email, name, image }) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { email, name, image }
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error('Error creating user');
  }

  return data;
}

export async function getUserData(email){
   let { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)

    if (error) {
        console.error(error);
        throw new Error('Error fetching user');
    }
    return data || null;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*') // Removed the join to 'profiles'
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error('Events could not be loaded');
  }

  return data;
}

export async function createEvent(eventData) {
  const { data, error } = await supabase.from('events').insert([eventData]);

  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Event could not be created.');
  }

  return data;
}

export async function getRsvpsForEvent(eventId) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('user_id')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
  return data;
}

// Adds an RSVP for the current user to a specific event
export async function addRsvp(eventId, userId) {
  if (!userId) throw new Error('User must be logged in to RSVP.');

  const { error } = await supabase
    .from('rsvps')
    .insert({ event_id: eventId, user_id: userId });

  if (error) {
    console.error('Error adding RSVP:', error);
    throw new Error('Could not RSVP for the event.');
  }
}

// Removes an RSVP for the current user from a specific event
export async function removeRsvp(eventId, userId) {
  if (!userId) throw new Error('User must be logged in to cancel RSVP.');

  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing RSVP:', error);
    throw new Error('Could not cancel RSVP.');
  }
}

export async function getCommentsForEvent(eventId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      users ( name )
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return data;
}

// Adds a new comment
export async function addComment(eventId, userId, content) {
  if (!userId) throw new Error('User must be logged in to comment.');

  const { data, error } = await supabase
    .from('comments')
    .insert({ event_id: eventId, user_id: userId, content: content })
    .select('*, users ( name )') // Return the new comment with user info
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw new Error('Could not post comment.');
  }
  return data;
}