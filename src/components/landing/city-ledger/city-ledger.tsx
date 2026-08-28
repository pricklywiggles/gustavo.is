import type { CityChapter } from "@/components/landing/work-history-data";
import { employmentHistory } from "@/lib/career";

// Over the full CHAPTERS, never the previewed story: career.ts reads "present" from the
// last chapter's span end, so a ?chapter=0 preview would otherwise mark Microsoft ongoing.
const LEDGER = employmentHistory();

const LEGEND =
	"font-bold font-legend text-[0.8125rem] text-dusk-earth tracking-[0.01em]";
const COLUMNS =
	"sm:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_minmax(0,1fr)_auto]";

function yearRange(start: number, end: number | null): string {
	return `${start} to ${end ?? "present"}`;
}

/** One city's companies, positions, products and years, shown under the static panorama;
 * hidden under motion, where the HUD tells it one stint at a time. */
export function CityLedger({ chapter }: { chapter: CityChapter }) {
	const jobs = LEDGER.filter((job) => job.city === chapter.name);
	const headingId = `ledger-${chapter.id}`;
	const ongoing = jobs.some((job) => job.end === null);
	return (
		<section
			data-city-ledger
			aria-labelledby={headingId}
			className="hidden bg-pale-dune motion-reduce:block"
		>
			<div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
				<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-dusk-earth/20 border-b pb-4">
					<h2
						id={headingId}
						className="font-bold font-display text-[clamp(1.875rem,2.6vw,2.25rem)] text-dusk-ink leading-[1.15]"
					>
						{chapter.name}
					</h2>
					<p className={`${LEGEND} tabular-nums`}>
						{yearRange(chapter.span[0], ongoing ? null : chapter.span[1])}
					</p>
				</div>
				<div
					className={`hidden gap-x-8 pt-5 pb-2 sm:grid ${COLUMNS} ${LEGEND}`}
				>
					<span>Company</span>
					<span>Positions</span>
					<span>Products</span>
					<span className="text-right">Years</span>
				</div>
				<ol className="divide-y divide-dusk-earth/20">
					{jobs.map((job) => (
						<li
							key={`${job.company}-${job.start}`}
							className={`grid gap-x-8 gap-y-4 py-5 ${COLUMNS}`}
						>
							<h3 className="font-bold font-display text-dusk-ink text-xl leading-[1.3]">
								{job.company}
							</h3>
							<div>
								<span className={`${LEGEND} mb-1 block sm:hidden`}>
									Positions
								</span>
								<ul className="space-y-1 text-dusk-ink leading-[1.6]">
									{job.roles.map((role) => (
										<li key={role.title}>{role.title}</li>
									))}
								</ul>
							</div>
							<div>
								<span className={`${LEGEND} mb-1 block sm:hidden`}>
									Products
								</span>
								<ul className="space-y-1 text-dusk-ink/85 leading-[1.6]">
									{job.products.map((product) => (
										<li key={product}>{product}</li>
									))}
								</ul>
							</div>
							<p className={`${LEGEND} tabular-nums sm:text-right`}>
								<span className="mr-2 sm:hidden">Years</span>
								<span className="text-dusk-ink">
									{yearRange(job.start, job.end)}
								</span>
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
