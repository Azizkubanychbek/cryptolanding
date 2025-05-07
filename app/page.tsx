import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { ArchitectureSection } from '@/components/sections/architecture-section';
import { StatisticsSection } from '@/components/sections/statistics-section';
import { TokenomicsSection } from '@/components/sections/tokenomics-section';
import { RoadmapSection } from '@/components/sections/roadmap-section';
import { InvestorsSection } from '@/components/sections/investors-section';
import { DocsSection } from '@/components/sections/docs-section';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ParallaxProvider } from '@/components/providers/parallax-provider';
import { Suspense } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ParallaxProvider>
        <main className="relative overflow-hidden">
          <Header />
          <HeroSection />
          <FeaturesSection />
          <ArchitectureSection />
          <StatisticsSection />
          <TokenomicsSection />
          <RoadmapSection />
          <InvestorsSection />
          <DocsSection />
          <Footer />
        </main>
      </ParallaxProvider>
    </Suspense>
  );
}