'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Photo = { src: string; alt: string }

const SLIDES: { subject: string; predicate: string; photos: Photo[] }[] = [
  {
    subject: 'an LA based software engineer',
    predicate: 'a proven record of product launches',
    photos: [
      { src: '/photos/kiwi_1.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_2.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_3.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_1.png', alt: 'Kiwi' },
    ],
  },
  {
    subject: 'a dog dad',
    predicate: 'a wonderful rescue dog.',
    photos: [
      { src: '/photos/kiwi_2.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_3.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_1.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_2.png', alt: 'Kiwi' },
    ],
  },
  {
    subject: 'a tinkerer at heart',
    predicate: 'a string of midnight experiments.',
    photos: [
      { src: '/photos/kiwi_3.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_1.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_2.png', alt: 'Kiwi' },
      { src: '/photos/kiwi_3.png', alt: 'Kiwi' },
    ],
  },
]

// Per-position tilt — feels hand-placed
const ALL_ROTATIONS = [-3, 1.5, -2.5, 2]

// Curved string: sag amount at centre (px, in the strip's coordinate space)
const SAG_PX = 14
// SVG viewBox height — must comfortably contain the curve + stroke
const SVG_H = SAG_PX * 2 + 6
// Y of the string endpoints in the viewBox (small top margin so stroke isn't clipped)
const STRING_Y0 = 3

/**
 * For n cards laid out with justify-around, card i has its centre at
 * fractional x = (2i+1)/(2n). The bezier Y at that position is:
 *   y(p) = STRING_Y0 + 4 * SAG_PX * p * (1-p)
 * Using this as marginTop makes each clothespin top touch the curve exactly.
 */
function computeStringOffsets(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const p = (2 * i + 1) / (2 * count)
    return Math.round(STRING_Y0 + 4 * SAG_PX * p * (1 - p))
  })
}

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const subjectRefs = useRef<Array<HTMLSpanElement | null>>([])
  const predicateRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [cardCount, setCardCount] = useState(4)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCardCount(2)
      else if (window.innerWidth < 768) setCardCount(3)
      else setCardCount(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const subjects = subjectRefs.current.filter(Boolean) as HTMLSpanElement[]
      const predicates = predicateRefs.current.filter(Boolean) as HTMLSpanElement[]

      gsap.set([...subjects.slice(1), ...predicates.slice(1)], { y: 80, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(SLIDES.length - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.8,
        },
      })

      for (let i = 0; i < SLIDES.length - 1; i++) {
        tl.to(
          [subjects[i], predicates[i]],
          { y: -24, ease: 'none', duration: 0.6 },
          i,
        )
        tl.to(
          [subjects[i], predicates[i]],
          { y: -140, opacity: 0, ease: 'power3.in', duration: 0.4 },
          i + 0.6,
        )
        tl.to(
          [subjects[i + 1], predicates[i + 1]],
          { y: 0, opacity: 1, ease: 'power4.out', duration: 0.35 },
          i + 0.65,
        )
      }
    },
    { scope: sectionRef },
  )

  const cards = SLIDES[0].photos.slice(0, cardCount)
  const offsets = computeStringOffsets(cardCount)
  const rotations = ALL_ROTATIONS.slice(0, cardCount)

  // SVG bezier path: string endpoints at STRING_Y0, control point at centre with full sag
  const controlY = STRING_Y0 + SAG_PX * 2
  const stringPath = `M 0,${STRING_Y0} Q 50,${controlY} 100,${STRING_Y0}`

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col bg-ground-4"
      aria-label="Introduction"
    >
      {/* Top 2/3 — text */}
      <div className="flex-2 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28 xl:px-36">
        <p
          className="text-6xl sm:text-7xl md:text-8xl font-light leading-[1.05]"
          style={{ color: 'var(--color-sky-1)' }}
        >
          I&apos;m
        </p>

        <div className="relative overflow-hidden">
          {SLIDES.map((slide, i) => (
            <span
              key={i}
              ref={el => { subjectRefs.current[i] = el }}
              className={`block text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-tight ${
                i === 0 ? 'relative' : 'absolute inset-x-0 top-0'
              }`}
              style={{ color: 'var(--color-sky-3)' }}
              aria-hidden={i !== 0 ? true : undefined}
            >
              {slide.subject}
            </span>
          ))}
        </div>

        <p
          className="text-6xl sm:text-7xl md:text-8xl font-light leading-[1.05] mt-3 sm:mt-4 md:mt-5"
          style={{ color: 'var(--color-sky-1)' }}
        >
          with
        </p>

        <div className="relative overflow-hidden">
          {SLIDES.map((slide, i) => (
            <span
              key={i}
              ref={el => { predicateRefs.current[i] = el }}
              className={`block text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-tight ${
                i === 0 ? 'relative' : 'absolute inset-x-0 top-0'
              }`}
              style={{ color: 'var(--color-sky-3)' }}
              aria-hidden={i !== 0 ? true : undefined}
            >
              {slide.predicate}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom 1/3 — photo strip */}
      <div className="flex-1 relative" aria-hidden="true">
        {/* Curved string — bezier sags under the weight of the cards */}
        <svg
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: SVG_H }}
          viewBox={`0 0 100 ${SVG_H}`}
          preserveAspectRatio="none"
        >
          <path
            d={stringPath}
            stroke="var(--color-ground-1)"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </svg>

        {/* Cards — marginTop places each clothespin exactly on the curve */}
        <div className="absolute inset-0 flex items-start justify-around">
          {cards.map((photo, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{
                transform: `rotate(${rotations[i]}deg)`,
                transformOrigin: 'top center',
                marginTop: offsets[i],
              }}
            >
              <Clothespin />
              <Image
                src={photo.src}
                alt={photo.alt}
                width={407}
                height={640}
                className="block w-16 sm:w-20 md:w-24 h-auto"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.40)) drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Clothespin() {
  return (
    <div
      style={{
        width: 12,
        height: 28,
        flexShrink: 0,
        marginBottom: -8,
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(160deg, #d9b07a 0%, #9e7448 65%, #caa06a 100%)',
        borderRadius: '2px 2px 1px 1px',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.18), 0 2px 4px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '46%',
          height: 1.5,
          background: 'rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}
