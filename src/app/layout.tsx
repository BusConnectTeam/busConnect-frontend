import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Providers } from '@/lib/providers';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Fuente Inter con subsets y display swap para mejor rendimiento
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BusConnect - Plataforma de reservas de autocares',
  description: 'Encuentra y reserva el autocar perfecto para tu viaje, evento o excursión en Catalunya. Compara precios de empresas verificadas.',
  keywords: 'autocar, autobús, reservas, Catalunya, Barcelona, transporte, viajes, excursiones, alquiler autocar',
  authors: [{ name: 'BusConnect' }],
  creator: 'BusConnect',
  publisher: 'BusConnect',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://busconnect.es',
    siteName: 'BusConnect',
    title: 'BusConnect - Reserva de autocares en Catalunya',
    description: 'Encuentra y reserva el autocar perfecto para tu viaje, evento o excursión en Catalunya.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BusConnect - Reserva de autocares',
    description: 'Encuentra el autocar perfecto para tu viaje en Catalunya.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2C5F5D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {/* Skip link ya está incluido en Navbar */}
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <AIChat />
        </Providers>
      </body>
    </html>
  );
}
