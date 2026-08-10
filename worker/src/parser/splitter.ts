// Moved to @bibliohelp/shared so the frontend can chunk requests with the SAME
// splitting the worker uses (client-side batching). Re-exported to keep worker
// imports stable.
export { splitReferences } from '@bibliohelp/shared';
