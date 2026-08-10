// Moved to @bibliohelp/shared so the frontend can re-run duplicate detection
// over the MERGED result set when it verifies in chunks (per-request detection
// cannot see across chunks). Re-exported to keep worker imports stable.
export { detectDuplicates } from '@bibliohelp/shared';
