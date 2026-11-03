// Prints the report-evidence Markdown generated from the data files the app reads.
import { evidenceMarkdown } from "../lib/evidence.ts";
process.stdout.write(evidenceMarkdown());
