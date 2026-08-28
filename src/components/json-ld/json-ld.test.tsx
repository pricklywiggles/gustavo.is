import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
	it("escapes < so data cannot close the script, and stays parseable", () => {
		const data = { headline: "Notes on </script><b>", n: 1 };
		const html = renderToStaticMarkup(<JsonLd data={data} />);
		expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
		expect(html).not.toContain("</script><b>");
		const json = html.slice(html.indexOf(">") + 1, html.lastIndexOf("<"));
		expect(JSON.parse(json)).toEqual(data);
	});
});
