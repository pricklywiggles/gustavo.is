"use client";

import { domAnimation, LazyMotion } from "motion/react";
import { usePathname } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { BarTheme } from "@/components/bar-themes";
import {
	ContactDialog,
	useContactDialogState,
} from "@/components/lazy-contact-dialog";
import { type BloomOrigin, MobileMenu } from "@/components/mobile-menu";
import { SiteBar } from "@/components/site-bar";

type HostState = {
	links: readonly { href: string; label: string }[];
	showContact: boolean;
	menuOpen: boolean;
	contactOpen: boolean;
	onContactIntent: () => void;
	onContactOpen: () => void;
	toggleFrom: (frame: HTMLElement | null) => void;
};

const BarHostContext = createContext<HostState | null>(null);

/** The initiating toggle's center, the bloom's anchor both ways. */
function toggleCenter(frame: HTMLElement | null): BloomOrigin | null {
	const toggle = frame?.querySelector('[aria-controls="mobile-nav"]');
	const rect = toggle?.getBoundingClientRect();
	return rect
		? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
		: null;
}

/**
 * One host per page: every bar the render prop places shares the menu, the lazy contact
 * dialog, and the gesture block; the menu blooms from the initiating toggle's center.
 */
export function BarHost({
	links,
	showContact,
	children,
}: {
	links: readonly { href: string; label: string }[];
	showContact: boolean;
	children: (bar: (theme: BarTheme) => React.ReactNode) => React.ReactNode;
}) {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	// True from close until the exit bloom finishes: gestures stay blocked through the
	// contraction, or a fling could move the opener under the frozen exit origin.
	const [menuExiting, setMenuExiting] = useState(false);
	const [origin, setOrigin] = useState<BloomOrigin | null>(null);
	const contact = useContactDialogState();
	// The frame that opened the menu; the close bloom re-measures its toggle, since the
	// flow can move while the menu is open (the blog hero keeps animating height).
	const openerRef = useRef<HTMLElement | null>(null);
	const menuOpenRef = useRef(menuOpen);
	menuOpenRef.current = menuOpen;

	const closeMenu = useCallback(() => {
		// No-op when already closed: a stray close must not set menuExiting with no exit
		// animation coming to clear it, or the gesture block strands.
		if (!menuOpenRef.current) return;
		const opener = openerRef.current;
		const fresh = opener?.isConnected ? toggleCenter(opener) : null;
		if (fresh) setOrigin(fresh);
		setMenuExiting(true);
		setMenuOpen(false);
	}, []);

	const toggleFrom = useCallback(
		(frame: HTMLElement | null) => {
			if (menuOpen) {
				closeMenu();
				return;
			}
			openerRef.current = frame;
			const fresh = toggleCenter(frame);
			if (fresh) setOrigin(fresh);
			setMenuOpen(true);
		},
		[menuOpen, closeMenu],
	);

	// Touch must not drag the page under the menu through the exit bloom (the frozen
	// close origin would desync); no overflow:hidden lock, which would un-stick sticky bars.
	const blockGestures = menuOpen || menuExiting;
	useEffect(() => {
		if (!blockGestures) return;
		const blockTouch = (e: TouchEvent) => e.preventDefault();
		document.addEventListener("touchmove", blockTouch, { passive: false });
		return () => {
			document.removeEventListener("touchmove", blockTouch);
		};
	}, [blockGestures]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, close every overlay on any route change
	useEffect(() => {
		// Through closeMenu, not bare setState: history navigation while the
		// menu is open must keep the gesture block through the exit bloom.
		closeMenu();
		contact.setOpen(false);
	}, [pathname]);

	const host: HostState = {
		links,
		showContact,
		menuOpen,
		contactOpen: contact.open,
		onContactIntent: contact.onIntent,
		onContactOpen: contact.openDialog,
		toggleFrom,
	};

	return (
		<>
			<LazyMotion features={domAnimation} strict>
				<BarHostContext.Provider value={host}>
					{children((theme) => (
						<HostedBar theme={theme} />
					))}
					<MobileMenu
						open={menuOpen}
						onClose={closeMenu}
						origin={origin}
						onExitComplete={() => setMenuExiting(false)}
					/>
				</BarHostContext.Provider>
			</LazyMotion>
			{/* Outside the strict provider on purpose: the form renders full
			    `motion` components, which trip the strict-mode invariant. */}
			{contact.mounted && (
				<LazyMotion features={domAnimation}>
					<ContactDialog
						open={contact.open}
						onOpenChange={contact.setOpen}
						source="header"
					/>
				</LazyMotion>
			)}
		</>
	);
}

/** One placed bar: the frame carrying the theme's chrome and the bloom's measure target. */
function HostedBar({ theme }: { theme: BarTheme }) {
	const host = useContext(BarHostContext);
	const frameRef = useRef<HTMLDivElement | null>(null);
	if (!host) throw new Error("HostedBar must render inside BarHost");

	const chrome = theme.bar
		? `border-b transition-colors duration-300 ${theme.bar}`
		: "";

	return (
		<div ref={frameRef} className={chrome}>
			<SiteBar
				links={host.links}
				theme={theme}
				showContact={host.showContact}
				contactOpen={host.contactOpen}
				onContactIntent={host.onContactIntent}
				onContactOpen={host.onContactOpen}
				mobileOpen={host.menuOpen}
				onMobileToggle={() => host.toggleFrom(frameRef.current)}
			/>
		</div>
	);
}
