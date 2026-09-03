import { type ReactNode, useCallback, useEffect, useState } from "react";
import { RAMP_OKLCH, type RampToken, rampColor, rampHex } from "@/lib/ramp";
import {
	CONTRAST_INKS,
	CONTRAST_SURFACES,
	PALETTE,
	type TokenGroup,
} from "./palette-data";

const lightness = (slug: RampToken) => Number(RAMP_OKLCH[slug].split(" ")[0]);

const inkOn = (slug: RampToken) =>
	lightness(slug) > 0.62 ? rampColor("dusk-ink") : rampColor("first-light");

const entry = (slug: RampToken) => {
	const found = PALETTE.find((t) => t.slug === slug);
	if (!found) throw new Error(`${slug} is missing from PALETTE`);
	return found;
};

/**
 * Inline: Tailwind skips hidden dirs, and `@source .storybook/` would leak doc-only
 * utilities into the site CSS. Specificity and `!important` beat Storybook's docs theme.
 */
export function PaletteStyles() {
	return (
		<style>{`
			.sbdocs-content :is(p, li, td, th, blockquote) {
				font-family: var(--font-sans) !important;
			}
			.sbdocs-content :is(h1, h2, h3, h4) {
				font-family: var(--font-display) !important;
				word-spacing: -0.1em;
			}
			.sbdocs-content :is(code, pre) { font-family: var(--font-mono) !important; }

			.pal-strip, .pal-grid, .pal-matrix-scroll { margin: 1.5rem 0 !important; }
			.pal-rule, .pal-note { margin: 0 0 1rem !important; max-width: 78ch; }

			.pal-strip .pal-track {
				display: flex;
				height: 8rem;
				overflow: hidden;
				border-radius: 14px;
				border: 1px solid var(--color-sand-line);
			}
			.pal-strip .pal-step {
				flex: 1;
				position: relative;
				border: 0;
				padding: 0;
				cursor: pointer;
				transition: flex 200ms ease;
			}
			.pal-strip .pal-step:hover { flex: 1.6; }
			.pal-strip .pal-hex {
				position: absolute;
				inset: auto 0 0.5rem 0;
				text-align: center;
				font-family: var(--font-mono);
				font-size: 0.8125rem;
				opacity: 0;
				transition: opacity 140ms ease;
			}
			.pal-strip .pal-step:hover .pal-hex,
			.pal-strip .pal-step:focus-visible .pal-hex { opacity: 1; }
			.pal-strip .pal-axis {
				display: flex;
				justify-content: space-between;
				margin-top: 0.5rem;
				font-family: var(--font-mono);
				font-size: 0.8125rem;
				color: var(--color-canyon-brown);
			}

			.pal-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
				gap: 1.25rem;
			}
			.pal-grid .pal-card {
				display: flex;
				flex-direction: column;
				overflow: hidden;
				border-radius: 14px;
				border: 1px solid var(--color-sand-line);
				background: var(--color-sand-haze);
			}
			.pal-grid .pal-chip {
				position: relative;
				height: 6rem;
				border-bottom: 1px solid var(--color-sand-line);
			}
			.pal-grid .pal-flag {
				position: absolute;
				top: 0.625rem;
				right: 0.625rem;
				border-radius: 999px;
				border: 1px solid var(--color-sand-line);
				background: var(--color-first-light);
				padding: 0.125rem 0.5rem;
				font-family: var(--font-sans);
				font-size: 0.8125rem;
				font-weight: 500;
				color: var(--color-dusk-earth);
			}
			.pal-grid .pal-body {
				display: flex;
				flex: 1;
				flex-direction: column;
				gap: 0.75rem;
				padding: 1rem;
			}
			.pal-grid .pal-name {
				margin: 0;
				font-family: var(--font-display);
				font-size: 1.25rem;
				font-weight: 700;
				line-height: 1.3;
				word-spacing: -0.1em;
				color: var(--color-dusk-ink);
			}
			.pal-grid .pal-role {
				margin: 0;
				font-family: var(--font-sans);
				font-size: 1rem;
				line-height: 1.6;
				color: var(--color-dusk-earth);
			}
			.pal-grid .pal-values {
				margin-top: auto;
				display: flex;
				flex-direction: column;
			}

			.pal-val {
				display: flex;
				width: 100%;
				align-items: baseline;
				gap: 0.625rem;
				margin-left: -0.375rem;
				padding: 0.125rem 0.375rem;
				border: 0;
				border-radius: 6px;
				background: none;
				text-align: left;
				cursor: pointer;
				transition: background-color 100ms ease;
			}
			.pal-val:hover { background: var(--color-pale-dune); }
			.pal-val .pal-k {
				flex: none;
				width: 3rem;
				font-family: var(--font-sans);
				font-size: 0.8125rem;
				font-weight: 500;
				letter-spacing: 0.01em;
				color: var(--color-canyon-brown);
			}
			.pal-val .pal-v {
				font-family: var(--font-mono);
				font-size: 0.8125rem;
				word-break: break-all;
				color: var(--color-dusk-ink);
			}

			.pal-matrix-scroll { overflow-x: auto; padding-bottom: 0.5rem; }
			.pal-matrix { border-collapse: separate; border-spacing: 4px; }
			/* Storybook stripes docs tables; the stripe shows through the header column. */
			.pal-matrix tr { background: none !important; }
			.pal-matrix .pal-head {
				border: 0;
				background: none;
				padding: 0.375rem 0.5rem;
				white-space: nowrap;
				font-family: var(--font-sans) !important;
				font-size: 0.8125rem;
				font-weight: 500;
				color: var(--color-dusk-earth);
			}
			.pal-matrix .pal-row-head { text-align: right; }
			.pal-matrix .pal-cell {
				border: 0;
				border-radius: 8px;
				padding: 0.625rem 0.5rem;
				min-width: 86px;
				text-align: center;
				font-family: var(--font-mono) !important;
				font-size: 0.8125rem;
				font-weight: 500;
			}
			.pal-matrix .pal-grade {
				display: block;
				font-size: 0.8125rem;
				letter-spacing: 0.02em;
				opacity: 0.75;
			}
			.pal-matrix .pal-self { color: var(--color-canyon-brown); }

			.pal-dot {
				display: inline-block;
				width: 0.75rem;
				height: 0.75rem;
				margin-right: 0.375rem;
				transform: translateY(1px);
				border-radius: 6px;
				box-shadow: inset 0 0 0 1px oklch(0.2781 0.0296 256.85 / 15%);
			}
			.pal-rule {
				border-radius: 14px;
				background: var(--color-dusk-earth);
				padding: 1.25rem 1.5rem;
			}
			.pal-rule .pal-rule-title {
				margin: 0;
				font-family: var(--font-display);
				font-size: 1.25rem;
				font-weight: 700;
				word-spacing: -0.1em;
				color: var(--color-pale-dune);
			}
			.pal-rule .pal-rule-body {
				margin: 0.5rem 0 0;
				font-family: var(--font-sans);
				font-size: 1rem;
				line-height: 1.6;
				color: var(--color-pale-dune);
			}
			/* MDX wraps children in a paragraph, so the class never sits on the visible text. */
			.pal-rule .pal-rule-body :is(p, strong) {
				margin: 0 !important;
				font-size: 1rem !important;
				line-height: 1.6 !important;
				color: var(--color-pale-dune) !important;
			}
			.pal-note {
				display: flex;
				flex-direction: column;
				gap: 0.625rem;
				border-radius: 10px;
				border: 1px solid var(--color-sand-line);
				background: var(--color-pale-dune);
				padding: 1rem 1.25rem;
			}
			/* The MDX author owns these children, so specificity alone cannot reach them. */
			.pal-note :is(p, strong) {
				margin: 0 !important;
				font-size: 1rem !important;
				line-height: 1.6 !important;
				color: var(--color-dusk-ink) !important;
			}
			/* Storybook's code chip fights both grounds; mirrors .blog-prose in globals.css. */
			.pal-rule code, .pal-note code {
				border: 0 !important;
				border-radius: var(--radius-sm) !important;
				background: var(--color-dusk-ink) !important;
				padding: 0.125rem 0.375rem !important;
				font-family: var(--font-mono) !important;
				font-size: 0.875em !important;
				font-weight: 500 !important;
				color: var(--color-pale-dune) !important;
			}

			.pal-toast {
				position: fixed;
				bottom: 1.75rem;
				left: 50%;
				transform: translateX(-50%);
				z-index: var(--z-index-dev, 100);
				border-radius: 999px;
				background: var(--color-dusk-ink);
				padding: 0.5rem 1rem;
				font-family: var(--font-mono);
				font-size: 0.8125rem;
				color: var(--color-first-light);
				pointer-events: none;
				transition: opacity 150ms ease;
			}

			/* Ground picks the ring: this page is light warm ground, so Canyon Brown. */
			.pal-step:focus-visible {
				outline: 3px solid var(--color-canyon-brown);
				outline-offset: -3px;
			}
			.pal-val:focus-visible {
				outline: 3px solid var(--color-canyon-brown);
				outline-offset: 1px;
			}

			@media (prefers-reduced-motion: reduce) {
				.pal-step, .pal-val, .pal-hex, .pal-toast { transition: none; }
				.pal-strip .pal-step:hover { flex: 1; }
				.pal-strip .pal-hex { opacity: 1; }
			}
		`}</style>
	);
}

let announce: ((value: string) => void) | undefined;

function useCopy() {
	return useCallback((value: string) => {
		navigator.clipboard?.writeText(value).catch(() => {});
		announce?.(value);
	}, []);
}

function Toast() {
	const [copied, setCopied] = useState<string>();

	useEffect(() => {
		announce = setCopied;
		return () => {
			announce = undefined;
		};
	}, []);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(undefined), 1400);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<output
			aria-live="polite"
			className="pal-toast"
			style={{ opacity: copied ? 1 : 0 }}
		>
			{copied ? `copied ${copied}` : ""}
		</output>
	);
}

export function RampStrip() {
	const copy = useCopy();
	const warm = PALETTE.filter((t) => t.group !== "cool").sort(
		(a, b) => lightness(b.slug) - lightness(a.slug),
	);

	return (
		<div className="pal-strip">
			<div className="pal-track">
				{warm.map((t) => (
					<button
						type="button"
						key={t.slug}
						onClick={() => copy(rampHex(t.slug))}
						aria-label={`Copy ${t.name}, ${rampHex(t.slug)}`}
						title={`${t.name} ${rampHex(t.slug)}`}
						className="pal-step"
						style={{ background: rampColor(t.slug) }}
					>
						<span className="pal-hex" style={{ color: inkOn(t.slug) }}>
							{rampHex(t.slug)}
						</span>
					</button>
				))}
			</div>
			<div className="pal-axis">
				<span>L 0.99</span>
				<span>lightness</span>
				<span>L 0.28</span>
			</div>
			<Toast />
		</div>
	);
}

function Value({ label, value }: { label: string; value: string }) {
	const copy = useCopy();
	return (
		<button
			type="button"
			onClick={() => copy(value)}
			aria-label={`Copy ${value}`}
			className="pal-val"
		>
			<span className="pal-k">{label}</span>
			<span className="pal-v">{value}</span>
		</button>
	);
}

export function Swatches({ group }: { group: TokenGroup }) {
	return (
		<div className="pal-grid">
			{PALETTE.filter((t) => t.group === group).map((t) => (
				<article key={t.slug} className="pal-card">
					<div className="pal-chip" style={{ background: rampColor(t.slug) }}>
						<span
							className="pal-flag"
							title="The role this token answers to in DESIGN.md"
						>
							{t.label}
						</span>
					</div>
					<div className="pal-body">
						<h3 className="pal-name">{t.name}</h3>
						<p className="pal-role">{t.role}</p>
						<div className="pal-values">
							<Value label="var" value={`var(--color-${t.slug})`} />
							<Value label="css" value={rampColor(t.slug)} />
							<Value label="hex" value={rampHex(t.slug)} />
							<Value label="class" value={`bg-${t.slug}`} />
						</div>
					</div>
				</article>
			))}
		</div>
	);
}

function luminance(hex: string) {
	const n = Number.parseInt(hex.slice(1), 16);
	const channel = (byte: number) => {
		const u = byte / 255;
		return u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4;
	};
	return (
		0.2126 * channel((n >> 16) & 255) +
		0.7152 * channel((n >> 8) & 255) +
		0.0722 * channel(n & 255)
	);
}

/** WCAG 2.1 contrast between two tokens, computed from their sRGB projections. */
export function contrast(ink: RampToken, surface: RampToken) {
	const a = luminance(rampHex(ink));
	const b = luminance(rampHex(surface));
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const grade = (r: number) =>
	r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large" : "fail";

/** Each cell is painted in the pairing it measures: a number you cannot read is the finding. */
export function ContrastMatrix() {
	return (
		<div className="pal-matrix-scroll">
			<table className="pal-matrix">
				<thead>
					<tr>
						<th className="pal-head" />
						{CONTRAST_SURFACES.map((s) => (
							<th key={s} className="pal-head">
								{entry(s).name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{CONTRAST_INKS.map((ink) => (
						<tr key={ink}>
							<th scope="row" className="pal-head pal-row-head">
								{entry(ink).name}
							</th>
							{CONTRAST_SURFACES.map((surface) => {
								if (ink === surface) {
									return (
										<td key={surface} className="pal-cell pal-self">
											·
										</td>
									);
								}
								const r = contrast(ink, surface);
								return (
									<td
										key={surface}
										title={`${entry(ink).name} on ${entry(surface).name}: ${r.toFixed(2)}:1`}
										className="pal-cell"
										style={{
											background: rampColor(surface),
											color: rampColor(ink),
										}}
									>
										{r.toFixed(2)}
										<span className="pal-grade">{grade(r)}</span>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function Dot({ token }: { token: RampToken }) {
	return <span className="pal-dot" style={{ background: rampColor(token) }} />;
}

/** Body quotes DESIGN.md verbatim, so the page stays checkable against it. */
export function Rule({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="pal-rule">
			<h4 className="pal-rule-title">{title}</h4>
			<div className="pal-rule-body">{children}</div>
		</div>
	);
}

export function Note({ children }: { children: ReactNode }) {
	return <div className="pal-note">{children}</div>;
}
