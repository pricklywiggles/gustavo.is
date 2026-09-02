// Pose math for the hero year string, whose transform origin is its top-right corner.
// Pure so the geometry is unit-testable; the caller measures the boxes.

export type Box = {
	left: number;
	top: number;
	right: number;
	width: number;
	height: number;
};

// The scale caps at 1: Safari rasters text at layout size, so any upscale blurs.
export function heroPose(hero: Box, host: Box, target: number) {
	const scale =
		hero.width > 0 ? Math.min(1, (host.width * target) / hero.width) : 1;
	return {
		scale,
		x: host.left + host.width / 2 - (hero.right - (hero.width * scale) / 2),
		y: host.top + host.height / 2 - (hero.top + (hero.height * scale) / 2),
	};
}

// AnimateNumber pads its digits symmetrically, so their 1em line box is centered
// in the box it reports; the string's own line box has no padding.
export function dockPose(
	hero: Box,
	number: Box,
	heroFont: number,
	dockFont: number,
) {
	return {
		scale: heroFont > 0 ? dockFont / heroFont : 1,
		x: number.right - hero.right,
		y: number.top + (number.height - dockFont) / 2 - hero.top,
	};
}
