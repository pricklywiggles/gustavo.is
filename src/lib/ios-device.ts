/**
 * Device test behind the iOS scroll-smoothing paths (FRA-185). Safari and Chrome on iOS
 * share WebKit and its scroll reporting, so it tests the device, never the browser;
 * Android, desktop Safari, and every desktop browser stay on the raw baseline.
 */
export type DeviceHints = {
	userAgent: string;
	maxTouchPoints: number;
};

export function isIOSDeviceFrom({
	userAgent,
	maxTouchPoints,
}: DeviceHints): boolean {
	if (!(maxTouchPoints > 0)) return false;
	if (/iPhone|iPad|iPod/.test(userAgent)) return true;
	// iPadOS 13+ presents a Macintosh user agent; the touch count tells it from a Mac.
	return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

export function isIOSDevice(): boolean {
	if (typeof navigator === "undefined") return false;
	return isIOSDeviceFrom({
		userAgent: navigator.userAgent,
		maxTouchPoints: navigator.maxTouchPoints ?? 0,
	});
}
