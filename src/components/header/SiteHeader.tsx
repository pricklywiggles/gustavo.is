'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
gsap.registerPlugin(ScrollTrigger, useGSAP)

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73A1.77 1.77 0 1 1 6.5 3.2a1.77 1.77 0 0 1 0 3.53zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77C14.4 7.19 20 7 20 12.48V19z" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Blog', href: '/blog', Icon: null },
  { label: 'DummyLink', href: '#', Icon: null },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/gustavogallegos', Icon: LinkedInIcon },
  { label: 'GitHub', href: 'https://github.com/pricklywiggles', Icon: GitHubIcon },
]

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!headerRef.current || !nameRef.current || !navRef.current) return

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
    const letterInTween = gsap.fromTo(
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
    const letterOutTween = gsap.fromTo(
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

    const navTween = gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -8 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: 'body',
          start: `top+=${heroEnd - 200} top`,
          end: `top+=${heroEnd} top`,
          scrub: true,
        },
      },
    )

    // onEnter fires when scroll crosses heroEnd going forward (onLeave requires an `end` to fire).
    // Kill the ScrollTriggers directly — killing the tween alone doesn't kill its trigger.
    // gsap.set() then writes the final values so nothing can reverse them on scroll-back.
    let frozen = false
    ScrollTrigger.create({
      trigger: 'body',
      start: `top+=${heroEnd} top`,
      onEnter: () => {
        if (frozen) return
        frozen = true
        letterInTween.scrollTrigger?.kill()
        letterOutTween.scrollTrigger?.kill()
        navTween.scrollTrigger?.kill()
        gsap.set(letters, { scale: 1, opacity: 1 })
        gsap.set(Array.from(letters).slice(1), { scale: 0, opacity: 0 })
        if (navRef.current) gsap.set(navRef.current, { opacity: 1, y: 0 })
      },
    })
  })

  // backdrop-filter covers the gradient zone too, so content dissolves into blur before it fully hides.
  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-15 md:h-20"
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

      <nav
        ref={navRef}
        className="flex items-center gap-5 text-sm text-gray-800 font-sans"
        style={{ opacity: 0 }}
      >
        {NAV_LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="hover:opacity-70 transition-opacity"
          >
            {Icon ? <Icon size={18} /> : label}
          </a>
        ))}
      </nav>
    </header>
  )
}
