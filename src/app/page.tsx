import { ParallaxHero } from '@/components/hero/ParallaxHero'

export default function Home() {
  return (
    <main>
      <ParallaxHero />
      <div style={{ height: '100vh', background: '#6E5038', border: '1px solid #ccc' }} />
    </main>
  )
}
