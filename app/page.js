import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      <div className="relative min-h-[calc(102.2vh-5rem)] w-full">
        <Image
          src="/homeImage.jpg"
          alt="Background"
          fill
          objectFit="cover"
          objectPosition="top"
          quality={100}
          priority
        />
        {/* This overlay now adapts to the theme */}
        <div className="absolute inset-0 bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center text-center px-4">
          <div>
            {/* The text color also adapts to the theme for better contrast */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg">
              Connect. Collaborate. Celebrate.
            </h1>
            <Link href="/events">
              <div className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-lg">
                View Events
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
