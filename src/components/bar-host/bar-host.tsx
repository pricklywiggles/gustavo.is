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

function toggleCenter(frame: HTMLElement | null): BloomOrigin | null {
	const toggle = frame?.querySelector('[aria-controls="mobile-nav"]');
	const rect = toggle?.getBoundingClientRect();
	return rect
		? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
		: null;
}

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
	// True from close through the exit bloom: a fling could move the opener under the frozen origin.
	const [menuExiting, setMenuExiting] = useState(false);
	const [origin, setOrigin] = useState<BloomOrigin | null>(null);
	const contact = useContactDialogState();
	// Re-measured at close: the flow moves while the menu is open (the blog hero animates height).
	const openerRef = useRef<HTMLElement | null>(null);
	const menuOpenRef = useRef(menuOpen);
	menuOpenRef.current = menuOpen;

	const closeMenu = useCallback(() => {
		// No-op when already closed: menuExiting with no exit animation strands the gesture block.
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

	// Touch must not drag the page under the menu through the exit bloom (the frozen origin
	// desyncs); no overflow:hidden lock, which would un-stick the sticky bars.
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
		// Through closeMenu so a history navigation keeps the gesture block through the exit bloom.
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
