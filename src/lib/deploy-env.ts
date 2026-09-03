// VERCEL_ENV is "development" under `vercel dev`, so presence alone is not enough.
const DEPLOY_ENVS = new Set(["production", "preview"]);

/** True on a Vercel preview or production deploy; false locally, in CI, and under vercel dev. */
export function isVercelDeploy(): boolean {
	// || not ??: an empty string means unset here.
	const env = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
	return DEPLOY_ENVS.has(env ?? "");
}
