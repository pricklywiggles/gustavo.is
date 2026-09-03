import { afterEach, describe, expect, it, vi } from "vitest";
import { isVercelDeploy } from "./deploy-env";

describe("isVercelDeploy", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("is false with no Vercel env at all", () => {
		vi.stubEnv("VERCEL_ENV", "");
		vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "");
		expect(isVercelDeploy()).toBe(false);
	});

	it("is false under vercel dev", () => {
		vi.stubEnv("VERCEL_ENV", "development");
		expect(isVercelDeploy()).toBe(false);
	});

	it("is true on preview and production", () => {
		vi.stubEnv("VERCEL_ENV", "preview");
		expect(isVercelDeploy()).toBe(true);
		vi.stubEnv("VERCEL_ENV", "production");
		expect(isVercelDeploy()).toBe(true);
	});

	it("falls back to the NEXT_PUBLIC mirror in the browser bundle", () => {
		vi.stubEnv("VERCEL_ENV", "");
		vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
		expect(isVercelDeploy()).toBe(true);
	});
});
