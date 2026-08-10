import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("sphoono Personal Resume SSR worker", () => {
	describe("request for /", () => {
		it("responds with SSR HTML containing profile, projects, and Twitter bird link (unit style)", async () => {
			const request = new Request<unknown, IncomingRequestCfProperties>(
				"http://example.com/"
			);
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);
			const html = await response.text();
			expect(html).toContain("sphoono");
			expect(html).toContain("terraform-provider-k0s");
			expect(html).toContain("https://twitter.com/SPhoono");
			expect(html).toContain('canvas id="bg"');
		});

		it("responds with SSR HTML (integration style)", async () => {
			const request = new Request("http://example.com/");
			const response = await SELF.fetch(request);
			const html = await response.text();
			expect(html).toContain("sphoono");
			expect(html).toContain("homelab");
		});
	});

	describe("request for /api/random", () => {
		it("responds with JSON containing random UUID (unit style)", async () => {
			const request = new Request<unknown, IncomingRequestCfProperties>(
				"http://example.com/api/random"
			);
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);
			const data = (await response.json()) as { uuid: string };
			expect(data.uuid).toMatch(
				/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
			);
		});

		it("responds with JSON containing random UUID (integration style)", async () => {
			const request = new Request("http://example.com/api/random");
			const response = await SELF.fetch(request);
			const data = (await response.json()) as { uuid: string };
			expect(data.uuid).toMatch(
				/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/
			);
		});
	});
});
