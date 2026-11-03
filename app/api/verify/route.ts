import { NextResponse } from "next/server";
import { verifyQuote } from "../../../lib/verify.ts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.chunk_id !== "string" || typeof body.quote !== "string") return NextResponse.json({ found: false, reason: "chunk_id and quote are required" }, { status: 400 });
  return NextResponse.json(verifyQuote(body.chunk_id, body.quote.slice(0, 5000)));
}
