import { ParallaxHero } from '@/components/hero/ParallaxHero';
import { IntroSection } from '@/components/landing/IntroSection';

export default function Home() {
  return (
    <main>
      <ParallaxHero />
      <IntroSection />
      <div className="h-32" /> {/* bottom padding so last section can scroll up fully while we test */}
    </main>
  );
}
