import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Cloudflare-hosted database access. The Node-only better-sqlite3 fallback
 * cannot be bundled into the Workers runtime.
 */
export function getDb(env?: any) {
  const dbBinding = env?.DB;
  if (!dbBinding || typeof dbBinding.prepare !== "function") {
    throw new Error("Cloudflare D1 DB binding is missing");
  }
  return drizzle(dbBinding, { schema });
}
