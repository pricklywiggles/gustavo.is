'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HEADER_HEIGHT = 80

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

    // back.out overshoot makes the scale briefly exceed 1 before settling — same scroll range as the fade.
    gsap.fromTo(
      nameRef.current,
      { scale: 0 },
      {
        scale: 1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=200',
          scrub: true,
        },
      },
    )
  })

  // backdrop-filter covers the gradient zone too, so content dissolves into blur before it fully hides.
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6"
      style={{
        height: HEADER_HEIGHT,
        opacity: 0,
        background: 'linear-gradient(to bottom, rgba(250, 232, 184, 0.7) 85%, rgba(250, 232, 184, 0.7) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <span
        ref={nameRef}
        className="text-6xl tracking-widest uppercase text-gray-800"
        style={{ fontFamily: 'var(--font-waves-signal)' }}
      >
        Gustavo Gallegos
      </span>
    </header>
  )
}
