import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Providers } from '@/lib/providers';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BusConnect - Plataforma de reservas de autocares',
  description: 'Encuentra y reserva el autocar perfecto para tu viaje, evento o excursión en Catalunya',
  keywords: 'autocar, autobús, reservas, Catalunya, Barcelona, transporte, viajes, excursiones',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={playfair.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <AIChat />
        </Providers>
      </body>
    </html>
  );
}
