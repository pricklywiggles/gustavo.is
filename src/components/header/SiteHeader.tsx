'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)


export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!headerRef.current || !nameRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(headerRef.current, { opacity: 1 })
      return
    }

    // onUpdate is required — plain scrub doesn't drive opacity precisely enough.
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (headerRef.current) headerRef.current.style.opacity = String(self.progress)
      },
    })

    const letters = nameRef.current.querySelectorAll<HTMLElement>('.letter')
    const vh = window.innerHeight
    // ParallaxHero wrapper is 200vh tall; exit animation completes as it leaves the viewport.
    const heroEnd = vh * 2

    // Stagger distributes each letter's animation across the scroll range left-to-right.
    // back.out overshoot makes each letter briefly exceed scale 1 before settling.
    gsap.fromTo(
      letters,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: 'back.out(2)',
        // stagger: 0.1,
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=800',
          scrub: true,
        },
      },
    )

    // All letters except the first G exit with the same staggered bounce-then-shrink.
    // back.in briefly overshoots above scale 1 before collapsing to 0.
    gsap.fromTo(
      Array.from(letters).slice(1),
      { scale: 1, opacity: 1 },
      {
        scale: 0,
        opacity: 0,
        ease: 'back.in(2)',
        stagger: { each: 0.04, from: 'end' },
        scrollTrigger: {
          trigger: 'body',
          start: `top+=${heroEnd - 300} top`,
          end: `top+=${heroEnd} top`,
          scrub: true,
        },
      },
    )
  })

  // backdrop-filter covers the gradient zone too, so content dissolves into blur before it fully hides.
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 h-15 md:h-20"
      style={{
        opacity: 0,
        background: 'linear-gradient(to bottom, rgba(250, 232, 184, 0.7) 85%, rgba(250, 232, 184, 0.7) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <span
        ref={nameRef}
        className="text-[1.8rem] md:text-6xl tracking-widest uppercase text-gray-800"
        style={{ fontFamily: 'var(--font-waves-signal)' }}
      >
        {'Gustavo Gallegos'.split('').map((char, i) => (
          <span
            key={i}
            className="letter inline-block"
            style={char === ' ' ? { opacity: 1 } : undefined}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </header>
  )
}
