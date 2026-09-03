import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps, ComponentType } from "react";
import { blogMdxComponents } from "@/components/blog/blog-mdx-components";
import { CodeSample, TS_SAMPLE } from "@/components/blog/code-sample";

const meta = {
	title: "Blog/Reading page prose",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// MDX runtime types do not describe these as plain React components.
const { a: A, blockquote: Quote } = blogMdxComponents as unknown as {
	a: ComponentType<ComponentProps<"a">>;
	blockquote: ComponentType<ComponentProps<"blockquote">>;
};

export const Specimen: Story = {
	render: () => (
		<div className="min-h-screen bg-dusk-earth px-6 py-16 sm:px-8">
			<div className="blog-prose prose mx-auto">
				<h2>A section heading</h2>
				<p>
					Body copy runs at the article measure in Wotfard. An{" "}
					<A href="/blog">internal link</A> routes through the curtain
					transition, an <A href="https://example.com">external one</A> opens in
					a new tab, and both wear the same hue-and-weight recipe. No underline:
					focus is the highlighter swipe instead, so tab to one to see it.
				</p>
				<p>
					Inline code such as <code>rampColor(&quot;dusk-earth&quot;)</code>{" "}
					takes a Dusk Ink chip, one step below the page.
				</p>

				<h3>A sub-heading</h3>
				<p>
					Counters read as text and take the 4.5:1 floor; bullets are glyphs and
					take 3:1. That is why the two lists below are coloured differently.
				</p>
				<ol>
					<li>Noon Sun counters hold 5.08:1 on this ground.</li>
					<li>The measure stays put whatever the list does.</li>
				</ol>
				<ul>
					<li>Dune Tan bullets hold 3.77:1, a glyph role.</li>
					<li>Never text, so the lower floor is the right one.</li>
				</ul>

				{/* Rendered through the map, not as a raw <blockquote>: markdown `>` never
				    reaches the typography plugin's default, so showing that would document
				    a treatment the site does not ship. */}
				<Quote>
					<p>
						A pull quote led by its Noon Sun mark, hanging in the left gutter so
						mark and quote read as one unit. Markdown <code>&gt;</code> quotes
						and the named <code>&lt;Blockquote&gt;</code> both land here.
					</p>
				</Quote>

				<hr />

				<h4>A minor heading</h4>
				<p>
					The rule above is a hairline broken by a disc, so it reads as a sun on
					the horizon rather than a divider.
				</p>

				<pre>
					<CodeSample lines={TS_SAMPLE} />
				</pre>

				<table>
					<thead>
						<tr>
							<th>Token</th>
							<th>Role</th>
							<th>On Dusk Earth</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Pale Dune</td>
							<td>Body, headings, quotes</td>
							<td>6.03:1</td>
						</tr>
						<tr>
							<td>Noon Sun</td>
							<td>Links, counters, the h2 period</td>
							<td>5.08:1</td>
						</tr>
						<tr>
							<td>Dune Tan</td>
							<td>Bullets, quote borders</td>
							<td>3.77:1</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	),
};
