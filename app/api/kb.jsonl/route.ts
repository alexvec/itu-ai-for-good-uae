import { chunks } from "../../../lib/data.ts";

export const dynamic = "force-static";

export function GET() {
  return new Response(chunks.map((c) => JSON.stringify(c)).join("\n") + "\n", {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "content-disposition": 'attachment; filename="kb.jsonl"' },
  });
}
