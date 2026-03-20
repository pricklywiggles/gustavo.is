'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HEADER_HEIGHT = 80

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!headerRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(headerRef.current, { opacity: 1 })
      return
    }

    // Fade in over the first 200px of scroll via raw scroll position.
    // onUpdate gives us precise progress so opacity tracks scroll exactly.
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (headerRef.current) headerRef.current.style.opacity = String(self.progress)
      },
    })
  })

  return (
    // Single element: solid amber at top grading to transparent at the bottom edge.
    // backdrop-filter blurs content behind the whole bar, including the transparent
    // gradient zone — so content approaching the header dissolves into blurred colour.
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: HEADER_HEIGHT,
        opacity: 0,
        background: 'linear-gradient(to bottom, rgba(250, 232, 184, 0.7) 85%, rgba(250, 232, 184, 0.7) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    />
  )
}
