import Benefits from '@/components/Benefits';
import CompanyCTA from '@/components/CompanyCTA';
import Hero from '@/components/Hero';
import VerifiedCompanies from '@/components/VerifiedCompanies';

export default function HomePage() {
  return (
    <>
      <Hero />
      <VerifiedCompanies />
      <Benefits />
      <CompanyCTA />
    </>
  );
}