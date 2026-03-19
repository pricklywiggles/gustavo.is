'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Tuning constants — adjust freely during experimentation
const PARALLAX = {
  sky1: 0.02,  // top/zenith — barely moves
  sky2: 0.05,
  sky3: 0.08,  // nearest horizon — moves most of sky bands
  sun: 0.06,
  ground1: 0.15,
  ground2: 0.25,
  ground3: 0.35,
  ground4: 0.45,
  character: 0.35, // moves with ground3 (second band from bottom)
}

const COLORS = {
  sky1: '#FAE8B8',   // pale golden — top/zenith
  sky2: '#F0C08A',   // warm peach/amber — mid sky
  sky3: '#F4935A',   // warm orange — near horizon
  sun: '#FFD166',    // golden yellow sun
  ground1: '#C9B89A',   // light sand/tan — nearest horizon
  ground2: '#AE9470',   // medium earth
  ground3: '#8E7050',   // warm brown
  ground4: '#6E5038',   // dark earth — floor
}

// Horizon sits at this % from the top of the scene
const HORIZON_PCT = 60

// Sky band top positions — visible height increases toward horizon (ratio 3/2 going down).
// Sky space = 60%. s1: 12.6% visible, s2: 18.9%, s3: 28.4%
const SKY_TOPS = {
  s1: 0.0,    // base — starts at top of scene
  s2: 11.6,   // s1 visible above = 12.6%
  s3: 20.5,   // s2 visible above = 18.9%, s3 extends to horizon (28.4%)
}

// Ground band top positions — each visible band height shrinks by 1/3 toward the horizon.
// With 40% of viewport below horizon, using ratio 2/3:
//   G4 visible: 16.6%, G3: 11.1%, G2: 7.4%, G1: 4.9%
const GROUND_TOPS = {
  g1: 60.0,   // at horizon
  g2: 64.9,   // +4.9%
  g3: 72.3,   // +7.4%
  g4: 83.4,   // +11.1% (leaves 16.6% visible to bottom)
}

// Character height in px — adjust if proportions look off
const CHARACTER_HEIGHT = 400
const CHARACTER_WIDTH = 200

export function ParallaxHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!wrapperRef.current || !sceneRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const vh = window.innerHeight

      sceneRef.current
        .querySelectorAll<HTMLElement>('[data-parallax]')
        .forEach(el => {
          const factor = parseFloat(el.dataset.parallax ?? '0')
          if (factor === 0) return

          gsap.to(el, {
            y: -(factor * vh),
            ease: 'none',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
        })
    },
    { scope: sceneRef },
  )

  return (
    // 200vh wrapper: 100vh visible scene + 100vh of scroll space for the parallax
    <div ref={wrapperRef} style={{ height: '200vh' }}>
      <div
        ref={sceneRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: COLORS.sky1 }}
      >
        {/* ── Sky — 3 contiguous bands, widening toward horizon ── */}

        {/* Sky 1 — pale golden top. Visible: 12.6% */}
        <div
          data-parallax={PARALLAX.sky1}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s1}%`, height: '200%', background: COLORS.sky1 }}
        />

        {/* Sky 2 — warm peach mid. Visible: 18.9% */}
        <div
          data-parallax={PARALLAX.sky2}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s2}%`, height: '200%', background: COLORS.sky2 }}
        />

        {/* Sky 3 — warm orange near horizon. Visible: 28.4% */}
        <div
          data-parallax={PARALLAX.sky3}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s3}%`, height: '200%', background: COLORS.sky3 }}
        />

        {/* ── Sun ─────────────────────────────────────── */}
        {/* Large circle, right side, straddling the horizon */}
        <div
          data-parallax={PARALLAX.sun}
          className="absolute rounded-full"
          style={{
            width: 'min(38vw, 38vh)',
            height: 'min(38vw, 38vh)',
            background: COLORS.sun,
            right: '1%',
            // Position so the bottom third of the sun sits below the horizon
            top: `calc(${HORIZON_PCT}% - min(36vw, 36vh))`,
          }}
        />

        {/* ── Ground ──────────────────────────────────── */}
        {/* Each band extends well below the viewport so it never shows a bottom edge */}

        {/* Ground 1 — light sand, nearest horizon. Visible height: ~4.9% */}
        <div
          data-parallax={PARALLAX.ground1}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g1}%`, height: '200%', background: COLORS.ground1 }}
        />

        {/* Ground 2. Visible height: ~7.4% */}
        <div
          data-parallax={PARALLAX.ground2}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g2}%`, height: '200%', background: COLORS.ground2 }}
        />

        {/* Ground 3. Visible height: ~11.1% */}
        <div
          data-parallax={PARALLAX.ground3}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g3}%`, height: '200%', background: COLORS.ground3 }}
        />

        {/* Ground 4 — darkest, floor. Visible height: ~16.6% */}
        <div
          data-parallax={PARALLAX.ground4}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g4}%`, height: '200%', background: COLORS.ground4 }}
        />

        {/* ── Lego character ──────────────────────────── */}
        {/* Positioned so feet land exactly on the top edge of ground band 1 */}
        <div
          data-parallax={PARALLAX.character}
          className="absolute"
          style={{
            // top edge at (g3_top - character height) so feet land on g3's top edge
            top: `calc(${GROUND_TOPS.g3}% - ${CHARACTER_HEIGHT}px + 40px)`,
            left: '4%',
          }}
        >
          <Image
            src="/lego-hero.png"
            alt="Lego Gustavo looking at the horizon"
            width={CHARACTER_WIDTH}
            height={CHARACTER_HEIGHT}
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
