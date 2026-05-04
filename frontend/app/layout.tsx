'use client';

import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className='h-full flex flex-col antialiased'>
        <AuthProvider>
          <Navbar />
          <main className='flex-1'>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
