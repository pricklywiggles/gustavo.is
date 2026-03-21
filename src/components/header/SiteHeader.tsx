'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation, useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73A1.77 1.77 0 1 1 6.5 3.2a1.77 1.77 0 0 1 0 3.53zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77C14.4 7.19 20 7 20 12.48V19z" />
    </svg>
  )
}

type IconComponent = (props: { size?: number }) => React.JSX.Element

interface NavLinkDef {
  label: string
  href: string
  Icon: IconComponent | null
}

const NAV_LINKS: NavLinkDef[] = [
  { label: 'Blog', href: '/blog', Icon: null },
  { label: 'DummyLink', href: '#', Icon: null },
  { label: 'Contact', href: '#contact', Icon: MailIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/gustavogallegos', Icon: LinkedInIcon },
  { label: 'GitHub', href: 'https://github.com/pricklywiggles', Icon: GitHubIcon },
]

function ShakeIcon({ Icon }: { Icon: IconComponent }) {
  const controls = useAnimation()
  const reducedMotion = useReducedMotion()
  return (
    <motion.span
      className="flex items-center"
      animate={controls}
      onHoverStart={() => {
        if (reducedMotion) return
        controls.start({ rotate: [0, -7, 6, -4, 2, 0], transition: { duration: 0.32, ease: 'easeInOut' } })
      }}
      onHoverEnd={() => {
        if (reducedMotion) return
        controls.start({ rotate: 0, transition: { duration: 0.1 } })
      }}
    >
      <Icon size={18} />
    </motion.span>
  )
}

function DesktopNavLink({ label, href, Icon }: NavLinkDef) {
  const isIconOnly = !!Icon
  return (
    <a
      href={href}
      aria-label={isIconOnly ? label : undefined}
      className={`group relative flex items-center ${isIconOnly ? 'px-2 py-2' : 'px-3 py-1.5'} rounded-full text-sm text-gray-800 font-sans`}
    >
      {/* Warm sand pill — blooms in from 90% scale */}
      <span
        className="absolute inset-0 rounded-full bg-sky-2/65 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out"
        aria-hidden
      />
      <span className="relative z-10">
        {Icon ? <ShakeIcon Icon={Icon} /> : label}
      </span>
    </a>
  )
}

function HeartFooter() {
  const reducedMotion = useReducedMotion()
  return (
    <motion.p
      className="text-xs text-gray-600 font-sans tracking-widest flex items-center justify-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.45, duration: 0.3 }}
    >
      Made with{' '}
      <motion.span
        aria-hidden
        animate={reducedMotion ? {} : { scale: [1, 1.4, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
      >
        ❤️
      </motion.span>
      {' '}in Los Angeles
    </motion.p>
  )
}

function MobileNavLink({ label, href, Icon, onClose }: NavLinkDef & { onClose: () => void }) {
  return (
    <a
      href={href}
      onClick={onClose}
      className="group relative flex items-center gap-4 text-2xl text-gray-800 font-sans py-1"
    >
      <span
        className="absolute -inset-y-2 -inset-x-4 rounded-xl bg-sky-2/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
        aria-hidden
      />
      {Icon && <span className="relative z-10"><Icon size={22} /></span>}
      <span className="relative z-10">{label}</span>
    </a>
  )
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMenu = () => {
    setMobileOpen(false)
    hamburgerRef.current?.focus()
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close on Escape and return focus to hamburger
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Focus trap: move focus into overlay on open, trap Tab within it
  useEffect(() => {
    if (!mobileOpen || !overlayRef.current) return

    const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [mobileOpen])

  // Desktop nav is invisible until GSAP scrolls it in — keep it out of tab order until then
  useEffect(() => {
    navRef.current?.setAttribute('inert', '')
  }, [])

  // Stagger mobile nav links in when the menu opens
  useEffect(() => {
    if (!mobileOpen || !mobileNavRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const links = mobileNavRef.current.querySelectorAll<HTMLElement>('a')
    gsap.set(links, { opacity: 0, x: 14 })
    gsap.fromTo(
      links,
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.28, ease: 'power2.out', stagger: 0.08, delay: 0.25 },
    )
  }, [mobileOpen])

  useGSAP(() => {
    if (!headerRef.current || !nameRef.current || !navRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(headerRef.current, { opacity: 1 })
      gsap.set(navRef.current, { opacity: 1 })
      navRef.current.removeAttribute('inert')
      return
    }

    // onUpdate is required — plain scrub doesn't drive opacity precisely enough.
    const opacityTrigger = ScrollTrigger.create({
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
          onEnter: () => navRef.current?.removeAttribute('inert'),
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
        opacityTrigger.kill()
        letterInTween.scrollTrigger?.kill()
        letterOutTween.scrollTrigger?.kill()
        navTween.scrollTrigger?.kill()
        if (headerRef.current) headerRef.current.style.opacity = '1'
        gsap.set(letters, { scale: 1, opacity: 1 })
        gsap.set(Array.from(letters).slice(1), { scale: 0, opacity: 0 })
        if (navRef.current) {
          navRef.current.removeAttribute('inert')
          gsap.set(navRef.current, { opacity: 1, y: 0 })
        }
      },
    })
  })

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* backdrop-filter covers the gradient zone too, so content dissolves into blur before it fully hides. */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-15 md:h-20"
        style={{
          opacity: 0,
          background:
            'linear-gradient(to bottom, oklch(0.9338 0.0650 89.92 / 90%) 93%, oklch(0.9338 0.0650 89.92 / 0%) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <span
          ref={nameRef}
          className="text-[1.8rem] md:text-4xl lg:text-5xl tracking-widest uppercase text-gray-800"
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

        {/* Desktop nav — animated by GSAP, hidden on mobile */}
        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-1"
          style={{ opacity: 0 }}
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <DesktopNavLink key={link.label} {...link} />
          ))}
        </nav>

        {/* Mobile toggle — always at z-50, above the bloom overlay */}
        <button
          ref={hamburgerRef}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="md:hidden relative z-50 text-gray-800 hover:opacity-70 transition-opacity p-1"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                className="block"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                className="block"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Mobile menu — radial bloom from hamburger position (top-right) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 md:hidden flex flex-col px-8 pt-24 pb-12"
            style={{
              background: 'oklch(0.9338 0.0650 89.92 / 96%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            initial={{ clipPath: 'circle(0% at calc(100% - 34px) 30px)' }}
            animate={{ clipPath: 'circle(170% at calc(100% - 34px) 30px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 34px) 30px)' }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.15, 1] }}
          >
            <nav id="mobile-nav" ref={mobileNavRef} className="flex flex-col gap-6 mt-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <MobileNavLink
                  key={link.label}
                  {...link}
                  onClose={closeMenu}
                />
              ))}
            </nav>

            {/* Ground-line footer */}
            <div
              className="mt-auto pt-8 border-t"
              style={{ borderColor: 'var(--color-ground-2)', opacity: 0.4 }}
            >
              <HeartFooter />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
