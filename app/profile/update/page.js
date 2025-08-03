import { auth } from '../../_lib/auth';
import { getUserData } from '@/app/_lib/DataService';
import UpdateProfileForm from './UpdateProfileForm';

export default async function UpdateProfilePage() {
  const session = await auth();
  const email = session?.user?.email;

  // Fetch the user's current data
  const userData = (await getUserData(email))?.[0] || {};

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Update Your Profile
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <UpdateProfileForm userData={userData} />
      </div>
    </div>
  );
}
