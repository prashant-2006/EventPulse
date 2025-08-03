import { redirect } from 'next/navigation';

export default function ProfilePage() {
  // Redirect to the show profile page by default
  redirect('/profile/show');
}
