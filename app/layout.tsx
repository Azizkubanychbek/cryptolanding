import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AudioProvider } from '@/components/providers/audio-provider';
import { cn } from '@/lib/utils';

// Font definitions
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'ArmaDEX | Next-Generation Decentralized Exchange',
  description: 'ArmaDEX is a next-generation decentralized exchange with advanced trading features, deep liquidity, and cutting-edge security.',
  keywords: ['decentralized exchange', 'DEX', 'crypto', 'trading', 'blockchain', 'ArmaDEX'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://armadex.io',
    title: 'ArmaDEX | Next-Generation Decentralized Exchange',
    description: 'ArmaDEX is a next-generation decentralized exchange with advanced trading features, deep liquidity, and cutting-edge security.',
    siteName: 'ArmaDEX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArmaDEX | Next-Generation Decentralized Exchange',
    description: 'ArmaDEX is a next-generation decentralized exchange with advanced trading features, deep liquidity, and cutting-edge security.',
    creator: '@armadex',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        jetbrainsMono.variable,
        orbitron.variable,
        'min-h-screen bg-cyberpunk-black font-sans antialiased'
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AudioProvider>
            {children}
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}