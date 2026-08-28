import { ContactScene } from "@/components/contact/contact-scene";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
	path: "/contact",
	title: "Say hello",
	description:
		"Send Gustavo Gallegos a message. I read everything that lands here.",
});

export default function ContactPage() {
	return (
		<main>
			<ContactScene />
		</main>
	);
}
