/**
 * Client-side chunking for /api/verify.
 *
 * One request carrying N references must finish inside the worker's 60 s
 * ceiling and Cloudflare's per-request subrequest budget; around 15–20
 * uncached references it starts timing out. Instead of raising limits, the
 * client splits the bibliography with the SAME `splitReferences` the worker
 * uses, sends small sequential requests, and the caller merges results as
 * they arrive (incremental progress) and re-runs duplicate detection over the
 * merged set.
 *
 * Chunking invariants (pinned by worker/src/parser/splitter.roundtrip.test.ts):
 * - a single-entry input is sent as the ORIGINAL text, never re-joined;
 * - multi-entry chunks always carry >= 2 entries joined by blank lines, so the
 *   worker's re-split deterministically takes the blank-line branch (BibTeX and
 *   RIS re-splits are format-marker driven and safe at any size).
 */
import { splitReferences } from '@bibliohelp/shared';

/** References per request. 4 uncached refs stay well under both ceilings. */
export const CHUNK_SIZE = 4;
/** Total cap across all chunks (25 requests worst case). */
export const MAX_TOTAL_REFS = 100;

export interface VerifyChunk {
  text: string;
  count: number;
}

/**
 * Split a bibliography into request-sized chunks. Sizes are balanced (never a
 * trailing 1-entry chunk) so re-splitting joined chunks is deterministic.
 */
export function buildChunks(text: string): { chunks: VerifyChunk[]; total: number } {
  const entries = splitReferences(text);
  if (entries.length <= 1) {
    return { chunks: [{ text, count: entries.length || 1 }], total: entries.length || 1 };
  }
  const n = entries.length;
  const parts = Math.ceil(n / CHUNK_SIZE);
  if (parts === 1) {
    return { chunks: [{ text, count: n }], total: n };
  }
  const base = Math.floor(n / parts);
  let extra = n % parts;
  const chunks: VerifyChunk[] = [];
  let at = 0;
  for (let p = 0; p < parts; p++) {
    const size = base + (extra-- > 0 ? 1 : 0);
    const slice = entries.slice(at, at + size);
    at += size;
    chunks.push({ text: slice.join('\n\n'), count: slice.length });
  }
  return { chunks, total: n };
}
