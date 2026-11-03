// Usage: node scripts/verify-audit.ts <log.jsonl> [--head <sha256>]
// Exit code 0 when the chain verifies, 1 when it does not.
import { readFileSync } from "node:fs";
import { verifyLog } from "../lib/audit.ts";

const [file, flag, head] = process.argv.slice(2);
if (!file) {
  console.error("usage: node scripts/verify-audit.ts <log.jsonl> [--head <sha256>]");
  process.exit(2);
}
const result = verifyLog(readFileSync(file), flag === "--head" ? head : undefined);
if (result.ok) {
  console.log(`VERIFIED: ${result.lines} lines, head ${result.head}`);
} else {
  console.error(`FAILED at line ${result.at_line}: ${result.error}`);
  process.exit(1);
}
