import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArmaDEX - Decentralized Exchange',
  description: 'Trade crypto assets on ArmaDEX - A non-custodial decentralized exchange',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}