import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { useMounted } from "./use-mounted";

function Probe() {
	return String(useMounted());
}

describe("useMounted", () => {
	it("reads false on the server render", () => {
		expect(renderToString(createElement(Probe))).toBe("false");
	});

	it("reads true from the first render of a client-only mount", () => {
		const { result } = renderHook(() => useMounted());
		expect(result.current).toBe(true);
	});
});
