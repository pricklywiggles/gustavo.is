'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PARALLAX = {
  sky1: 0.02,
  sky2: 0.05,
  sky3: 0.08,
  sun: 0.06,
  ground1: 0.15,
  ground2: 0.25,
  ground3: 0.35,
  ground4: 0.45,
  character: 0.35, // matches ground3 so character stands on that band
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

const CHARACTER_HEIGHT = 400
const CHARACTER_WIDTH = 200

// Scroll progress (0–1) at which all ground bands have collapsed to the horizon.
// = (g4_initial% - HORIZON_PCT%) / (ground4_factor * 100%) = 23.4 / 45 ≈ 0.52
const CONVERGENCE_PROGRESS = 0.55

const SHRINK_SCALE = 0.1

export function ParallaxHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!wrapperRef.current || !sceneRef.current || !characterRef.current) return
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

      gsap.set(sunRef.current, { transformOrigin: 'center center' })
      gsap.to(sunRef.current, {
        scale: 1.3,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `top+=${CONVERGENCE_PROGRESS * vh} top`,
          end: 'bottom 55%',
          scrub: true,
        },
      })

      // transformOrigin keeps feet on the ground and left edge fixed as scale drops.
      gsap.set(characterRef.current, { transformOrigin: 'bottom left' })
      gsap.to(characterRef.current, {
        scale: SHRINK_SCALE,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `top+=${CONVERGENCE_PROGRESS * vh} top`,
          end: 'bottom 55%',
          scrub: true,
        },
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
        <div
          data-parallax={PARALLAX.sky1}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s1}%`, height: '200%', background: COLORS.sky1 }}
        />
        <div
          data-parallax={PARALLAX.sky2}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s2}%`, height: '200%', background: COLORS.sky2 }}
        />
        <div
          data-parallax={PARALLAX.sky3}
          className="absolute w-full"
          style={{ top: `${SKY_TOPS.s3}%`, height: '200%', background: COLORS.sky3 }}
        />

        <div
          ref={sunRef}
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

        {/* height: 200% ensures bands never expose a bottom edge as they parallax up */}
        <div
          data-parallax={PARALLAX.ground1}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g1}%`, height: '200%', background: COLORS.ground1 }}
        />
        <div
          data-parallax={PARALLAX.ground2}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g2}%`, height: '200%', background: COLORS.ground2 }}
        />
        <div
          data-parallax={PARALLAX.ground3}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g3}%`, height: '200%', background: COLORS.ground3 }}
        />
        <div
          data-parallax={PARALLAX.ground4}
          className="absolute w-full"
          style={{ top: `${GROUND_TOPS.g4}%`, height: '200%', background: COLORS.ground4 }}
        />

        {/* Feet anchored to g3 top edge via bottom positioning — no pixel calc needed */}
        <div
          ref={characterRef}
          data-parallax={PARALLAX.character}
          className="absolute left-[4%]"
          style={{ bottom: `${100 - GROUND_TOPS.g3}%` }}
        >
          <Image
            src="/lego-hero.png"
            alt="Lego Gustavo looking at the horizon"
            width={CHARACTER_WIDTH}
            height={CHARACTER_HEIGHT}
            priority
            className="object-contain object-bottom w-32.5 h-65 sm:w-50 sm:h-100"
          />
        </div>
      </div>
    </div>
  )
}
