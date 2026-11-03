import { evidenceMarkdown } from "../../../lib/evidence.ts";

export const dynamic = "force-static";

export function GET() {
  return new Response(evidenceMarkdown(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
