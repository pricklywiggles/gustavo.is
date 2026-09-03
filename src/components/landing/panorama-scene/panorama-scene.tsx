"use client";

import { type CSSProperties, memo, type Ref } from "react";
import {
	PANO_W_VH,
	PANO_W_VW,
	stageAspect,
} from "@/components/landing/panorama-geometry";
import type {
	MobilePlacement,
	PanoramaConfig,
} from "@/components/landing/work-history-data";

/** Mobile adaptations are CSS-gated: no JS here observes the breakpoint. */

// panorama-geometry owns the two numbers so the pacing math and the CSS can't drift.
const PANO_W = `max(${PANO_W_VW}vw, ${PANO_W_VH}vh)`;
// Additive-only calc (pre-halved values) fits the oldest calc() grammar browsers support.
const PANO_LEFT_CENTERED = `calc(50% - max(${PANO_W_VW / 2}vw, ${PANO_W_VH / 2}vh))`;

/** Clamped to real coverage slack, so any focusX degrades to an edge-flush crop.
 * focusX pre-multiplies into the pair: f * max(a, b) = max(f*a, f*b) for f >= 0. */
export function panoFocusLeft(focusX: number): string {
	const vw = +(focusX * PANO_W_VW).toFixed(2);
	const vh = +(focusX * PANO_W_VH).toFixed(2);
	return `clamp(calc(100% - var(--pano-w)), calc(50% - max(${vw}vw, ${vh}vh)), 0px)`;
}

// Custom properties keep the classes static for Tailwind while the values live in config.
const MOBILE_PLACEMENT_CLASSES =
	"left-(--mp-l) top-(--mp-t) w-(--mp-w) max-sm:left-(--mp-lm) max-sm:top-(--mp-tm) max-sm:w-(--mp-wm)";

function placementVars(
	style: CSSProperties,
	mobile: MobilePlacement,
): CSSProperties {
	const { left, top, width, ...rest } = style;
	return {
		...rest,
		"--mp-l": left,
		"--mp-t": top,
		"--mp-w": width,
		"--mp-lm": mobile.left ?? left,
		"--mp-tm": mobile.top ?? top,
		"--mp-wm": mobile.width ?? width,
	} as CSSProperties;
}

// The parent pushes scrub state per tick; the ~50-img layer tree must not reconcile along.
export const PanoramaScene = memo(function PanoramaScene({
	config,
	stageRef,
	veil = false,
}: {
	config: PanoramaConfig;
	stageRef: Ref<HTMLDivElement>;
	/** The last scene carries the dusk veil (buildDusk). */
	veil?: boolean;
}) {
	const sun = config.sun;
	// Sun config coords are the disc's CENTER: baked into offsets so scale-up radiates from it.
	const sunBox = (left: number, top: number, size: number) => ({
		left: `${left - size / 2}%`,
		top: `${top - (size / 2) * stageAspect(config)}%`,
		width: `${size}%`,
	});
	const sunTrackStyle = (() => {
		if (!sun) return undefined;
		const rest = sunBox(sun.left, sun.top, sun.size);
		if (!sun.mobile) return rest;
		const m = sunBox(
			sun.mobile.left ?? sun.left,
			sun.mobile.top ?? sun.top,
			sun.size,
		);
		return placementVars(rest, m);
	})();
	// Reduced motion: layers at their authored rest are the finished composite.
	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 z-0 overflow-hidden motion-reduce:relative motion-reduce:h-screen"
		>
			{/* Positioned via left only (no x-translate), so offsetLeft stays layout-true
			    for the vessel geometry; below sm panoFocusLeft re-centers the crop. */}
			<div
				ref={stageRef}
				className="-translate-y-1/2 absolute top-1/2 left-(--pano-left-base) max-sm:left-(--pano-left)"
				style={
					{
						"--pano-w": PANO_W,
						"--pano-left-base": PANO_LEFT_CENTERED,
						"--pano-left": panoFocusLeft(config.mobileFocusX ?? 0.5),
						width: "var(--pano-w)",
						aspectRatio: config.aspect,
					} as CSSProperties
				}
			>
				{sun && (
					// Below every layer: clouds cross in front, the sun sets behind hills.
					<div
						data-pano-sun-track
						className={
							sun.mobile
								? `absolute motion-safe:will-change-transform ${MOBILE_PLACEMENT_CLASSES}`
								: "absolute motion-safe:will-change-transform"
						}
						style={sunTrackStyle}
					>
						{/* The track carries the crown's line; the disc pairs swell with an
						    equal-ease dive (see buildSunset). */}
						<div
							data-pano-sun
							className="w-full rounded-full motion-safe:will-change-transform"
							style={{
								aspectRatio: "1",
								background:
									"radial-gradient(circle, #fbe7c2 0%, #f6c493 55%, #f2a06e 100%)",
							}}
						/>
					</div>
				)}
				{config.layers.map((layer) => {
					const { src, ambient, drift, fill, mobile } = layer;
					const style = mobile
						? placementVars(layer.style, mobile)
						: layer.style;
					const placement = mobile ? ` ${MOBILE_PLACEMENT_CLASSES}` : "";
					return fill ? (
						// The extension covers layers that would show under the risen band.
						<div
							key={src}
							data-pano-layer
							className={`absolute${placement}`}
							style={style}
						>
							{/* biome-ignore lint/performance/noImgElement: layered scene sprites animate as plain elements; next/image adds nothing here */}
							<img
								src={src}
								alt=""
								loading="lazy"
								decoding="async"
								className="block w-full max-w-none"
							/>
							<div
								className="absolute left-0 w-full"
								style={{
									top: "calc(100% - 1px)",
									paddingBottom: "15%",
									background: fill,
								}}
							/>
						</div>
					) : ambient ? (
						// Without a GPU layer, sub-pixel sway snaps to whole pixels and hops.
						<div
							key={src}
							data-pano-sway
							className={`absolute motion-safe:will-change-transform${placement}`}
							style={style}
						>
							{/* biome-ignore lint/performance/noImgElement: layered scene sprites animate as plain elements; next/image adds nothing here */}
							<img
								src={src}
								alt=""
								data-pano-layer
								loading="lazy"
								decoding="async"
								className="w-full max-w-none"
							/>
						</div>
					) : (
						// max-w-none: preflight would pin wider-than-canvas strips at stage width.
						// biome-ignore lint/performance/noImgElement: layered scene sprites animate as plain elements; next/image adds nothing here
						<img
							key={src}
							src={src}
							alt=""
							data-pano-layer
							loading="lazy"
							decoding="async"
							className={
								drift
									? `absolute max-w-none motion-safe:will-change-transform${placement}`
									: `absolute max-w-none${placement}`
							}
							style={style}
						/>
					);
				})}
				{config.horizonLocked && (
					// Sea level caps the front water; this curtain opens the HUD band instead.
					<div
						data-pano-surface
						className="absolute left-0 w-full motion-safe:will-change-transform"
						style={{
							top: "100%",
							height: "30%",
							background:
								config.layers.find((l) => l.fill)?.fill ??
								"var(--color-pale-dune)",
						}}
					/>
				)}
				{veil && (
					<div
						data-pano-veil
						className="invisible absolute inset-0 bg-dusk-ink opacity-0"
					/>
				)}
			</div>
		</div>
	);
});
