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

export function SiteFooter() {
  return (
    <footer
      className="flex items-center justify-between px-6 py-5 text-sm font-sans"
      style={{ background: 'var(--color-ground-4)', color: 'var(--color-sky-1)' }}
    >
      <span style={{ opacity: 0.6 }}>
        © {new Date().getFullYear()} Gustavo Gallegos
      </span>
      <nav className="flex items-center gap-4" aria-label="Social links">
        <a
          href="https://linkedin.com/in/gustavogallegos"
          aria-label="LinkedIn"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <LinkedInIcon />
        </a>
        <a
          href="https://github.com/pricklywiggles"
          aria-label="GitHub"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <GitHubIcon />
        </a>
      </nav>
    </footer>
  )
}
