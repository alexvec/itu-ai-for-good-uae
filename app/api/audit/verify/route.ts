import { NextResponse } from "next/server";
import { verifyLog } from "../../../../lib/audit.ts";

export async function POST(req: Request) {
  const raw = Buffer.from(await req.arrayBuffer());
  if (raw.length > 5_000_000) return NextResponse.json({ error: "log too large" }, { status: 413 });
  return NextResponse.json(verifyLog(raw));
}
