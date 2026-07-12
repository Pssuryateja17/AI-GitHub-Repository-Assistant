// Re-exports the types already defined in history.service.ts so other modules
// (controllers, routes) can import from a conventional `history.types` path
// without duplicating the type definitions themselves.
export type { AnalysisHistoryEntry, PaginatedHistoryResult } from './history.service';
