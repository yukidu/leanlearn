/**
 * LeanLearn's Cloudflare Worker entrypoint.
 *
 * The repository's original server.ts uses Node-only helpers and a Vite
 * virtual import, so it cannot be used directly as a Wrangler entrypoint.
 * React Router's compiled server build provides the same route components.
 *
 * This is a self-contained demo preview. DEMO_MODE is intentionally not
 * an authentication mechanism and MUST be removed before production use.
 */
import { createRequestHandler } from "react-router";
import * as build from "./build/server/index.js";

type Env = {
  DB: D1Database;
  ASSETS: Fetcher;
  DEMO_MODE?: string;
  NODE_ENV?: string;
};

const requestHandler = createRequestHandler(build as any, "production");

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/health") {
      return Response.json({ status: "ok", mode: "demo" });
    }
    if (pathname.startsWith("/api/auth/")) {
      return Response.json({ error: "Google sign-in is not configured in this demo preview." }, { status: 503 });
    }
    const demoUser = env.DEMO_MODE === "true"
      ? { id: "leanlearn-demo-student", name: "Demo Student", email: "demo@example.invalid" }
      : null;
    return requestHandler(request, { user: demoUser, env });
  },
};
