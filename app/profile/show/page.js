import { auth } from '../../_lib/auth';
import { getUserData } from '@/app/_lib/DataService';
import { UserCircleIcon } from '@heroicons/react/24/solid'; // Using solid for a filled icon

export default async function ShowProfilePage() {
  const session = await auth();
  const email = session?.user?.email;

  // Fetch user data, defaulting to an empty object if not found
  const userData = (await getUserData(email))?.[0] || {};

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        My Profile
      </h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserCircleIcon className="w-24 h-24 text-gray-400" />
            )}
          </div>

          {/* Profile Details */}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold">{session?.user?.name}</h2>
            <p className="text-md text-gray-500 dark:text-gray-400">
              {session?.user?.email}
            </p>

            <div className="mt-4 space-y-2">
              <div>
                <h3 className="font-semibold text-lg">Bio</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {userData?.bio || 'No bio provided.'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Skills & Interests</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {userData?.skills || 'No skills listed.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
