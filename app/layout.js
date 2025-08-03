// app/layout.js
import '@/app/_styles/global.css';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/Navbar';
import { auth } from './_lib/auth';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'EventPulse',
  description: 'Connect. Collaborate. Celebrate.',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar session={session} />
          <main className='mt-16'><SessionProvider>{children}</SessionProvider></main>
        </ThemeProvider>
      </body>
    </html>
  );
}
