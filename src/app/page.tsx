import Benefits from '@/components/Benefits';
import CompanyCTA from '@/components/CompanyCTA';
import HeroSection from '@/components/HeroSection';
import VerifiedCompanies from '@/components/VerifiedCompanies';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VerifiedCompanies />
      <Benefits />
      <CompanyCTA />
    </>
  );
}