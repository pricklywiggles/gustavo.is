const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{jsx,tsx}'],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        well: '0 2px 0 hsla(0, 0%, 100%, .15) '
      },
      fontSize: {
        tiny: ['0.6rem', { letterSpacing: '0em', lineHeight: '1rem' }]
      },
      fontFamily: {
        sans: ['Wotfard', ...defaultTheme.fontFamily.sans],
        archia: ['Archia'],
        quirky: ['Indie Flower'],
        mono: ['Basier', ...defaultTheme.fontFamily.mono],
        code: ['Basier']
      },
      scale: {
        101: '1.01',
        90: '0.9'
      },
      fill: {
        blue: colors.blue['800']
      },
      colors: {
        cyan: colors.cyan,
        yellow: colors.yellow,
        coolGray: colors.coolGray,
        blueGray: colors.blueGray,
        lt: {
          primary: {
            ...colors.indigo,
            lightest: colors.indigo['400'],
            lighter: colors.indigo['500'],
            DEFAULT: colors.indigo['600'],
            darker: colors.indigo['700'],
            darkest: colors.indigo['800']
          },
          bg: {
            // 0: "rgba(165, 243, 252, 0)", // cyan-200
            // 8: "rgba(165, 243, 252, 0.8)",
            // 0: "rgba(228,228,231,0)", // gray.200
            // 8: "rgba(228,228,231,0.8)",
            ...colors.gray,
            8: 'rgba(228,228,231, 0.8)',
            lightest: colors.gray['50'],
            lighter: colors.gray['100'],
            DEFAULT: colors.gray['200'],
            darker: colors.gray['300'],
            darkest: colors.gray['400']
          },
          accent: {
            DEFAULT: colors.cyan[800],
            ...colors.indigo
          }
        },
        error: { ...colors.red, DEFAULT: colors.red[500] },
        dk: {
          primary: {
            ...colors.indigo,
            lightest: colors.indigo['400'],
            lighter: colors.indigo['500'],
            DEFAULT: colors.indigo['600'],
            darker: colors.indigo['700'],
            darkest: colors.indigo['800']
          },
          bg: {
            // 0: "rgba(17, 24, 39, 0)", // used for header gradient (blueGray-900)
            // 8: "rgba(17, 24, 39, 0.8)", // used for menu button background (blueGray)
            // 1000: "rgb(11, 16, 25)", // blueGray
            ...colors.gray,
            0: 'rgba(24,25,28, 0)',
            8: 'rgba(24,25,28, 0.8)',
            1000: 'rgb(18,18,18)',
            lightest: colors.gray['700'],
            lighter: colors.gray['800'],
            DEFAULT: colors.gray['900'],
            darker: 'rgb(18,18,18)',
            darkest: 'rgb(0, 0, 0)'
          },
          accent: {
            DEFAULT: colors.yellow[200],
            ...colors.yellow
          }
        },
        primary: '#f6f1ed',
        accentdark: {
          DEFAULT: colors.yellow[200],
          ...colors.yellow
        },
        accentlight: {
          DEFAULT: colors.indigo[900],
          ...colors.indigo
        },
        zIndex: {
          '-10': '-10'
        }
      },
      transitionTimingFunction: {
        boing: 'cubic-bezier(0.77, 0, 0.175, 1)'
      },
      keyframes: {
        typewrite: {
          from: { width: '0%' },
          to: { width: '100%' }
        },
        blink: {
          from: {
            borderRight: '2px solid',
            borderColor: 'darkgray'
          },
          to: { borderRight: '2px solid transparent' }
        },
        'font-bounce': {
          '0%, 100%': { fontSize: defaultTheme.fontSize.sm },
          '50%': { fontSize: defaultTheme.fontSize['3xl'] }
        },
        'font-accent': {
          '0%, 100%': { fontSize: defaultTheme.fontSize.sm },
          '50%': { fontSize: defaultTheme.fontSize['3xl'] }
        },
        'font-bounce-small': {
          '0%, 100%': { fontSize: defaultTheme.fontSize.sm },
          '50%': { fontSize: defaultTheme.fontSize['xl'] }
        },
        'scroll-lg': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-1278px)' }
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        beat: {
          '0%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(0.8)' }
        },
        'hero-scroll': {
          '0%': { transform: 'rotate(-13deg) translateY(0)' },
          '100%': { transform: 'rotate(-13deg) translateY(-1278px)' }
        },
        'concept-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-3853px)' }
        }
      },
      animation: {
        typewrite:
          'typewrite 4s steps(29) 1s 1 normal both, blink 600ms steps(29) infinite',
        blinky: 'blink 600ms steps(29) infinite',
        'font-bounce':
          'font-bounce 0.5s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95) none',
        'font-beat':
          'font-bounce-small 1s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95) infinite',
        'scroll-lg': 'scroll-lg 35s linear infinite',
        beat: 'beat 1s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95) infinite',
        'hero-scroll': 'hero-scroll 35s linear infinite',
        'concept-scroll': 'concept-scroll 240s linear infinite',
        'fade-in': 'fade-in 0.5s ease-in forwards'
      },
      maxWidth: {
        measure: 'var(--measure)'
      },
      backgroundImage: {
        'concept-doodle': "url('/hero-pattern-lg.png')",
        'ponder-hero': "url('/ponder-hero.png')",
        'ponder-blogs-hero': "url('/ponder-blogs-hero.png')",
        'concept-positive': "url('/concept-positive.png')",
        'concept-negative': "url('/concept-negative.png')",
        'concept-positive-bw': "url('/concept-positive-bw.png')"
      },
      backgroundSize: {
        hero: '800px auto'
      }
    }
  },
  variants: {
    extend: {
      cursor: ['hover'],
      borderStyle: ['hover', 'focus'],
      ringWidth: ['hover'],
      ringColor: ['hover'],
      opacity: ['dark'],
      animation: ['active'],
      scale: ['hover'],
      boxShadow: ['active']
    }
  },
  plugins: []
};
