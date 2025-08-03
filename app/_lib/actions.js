"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

export async function signInAction(){
    await signIn('google', {redirectTo: "/profile"});
}

export async function signOutAction(){
    await signOut({redirectTo: "/"});
}

export async function updateProfileAction(formData) {
  const session = await auth();
  if (!session) {
    throw new Error('You must be logged in to update your profile.');
  }

  const name = formData.get('name');
  const bio = formData.get('bio');
  const skills = formData.get('skills');

  const { error } = await supabase
    .from('users') // Make sure this is your users table name
    .update({ name, bio, skills })
    .eq('email', session.user.email);

  if (error) {
    console.error('Supabase error:', error);
    return { error: 'Failed to update profile.' };
  }

  // Revalidate the path to ensure the new data is shown
  revalidatePath('/profile/update');

  return { success: true };
}