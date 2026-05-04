'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <body className='h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-300'>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className='flex-1'>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
