// Re-exports the type already defined in savedRepositories.service.ts so other
// modules (controllers, routes) can import from a conventional
// `savedRepositories.types` path without duplicating the type definition.
export type { SavedRepositoryEntry } from './savedRepositories.service';
