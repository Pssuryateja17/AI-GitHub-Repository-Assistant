import { ApiError } from '../../utils/ApiError';
import {
  createSavedRepository,
  deleteSavedRepositoryByIdForUser,
  findSavedRepositoriesByUser,
  findSavedRepositoryByUserAndFullName,
  isUniqueConstraintViolation,
} from './savedRepositories.repository';

export interface SavedRepositoryEntry {
  id: string;
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function toEntry(record: {
  id: string;
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SavedRepositoryEntry {
  return {
    id: record.id,
    userId: record.userId,
    repositoryFullName: record.repositoryFullName,
    repositoryUrl: record.repositoryUrl,
    note: record.note,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function saveRepositoryForUser(params: {
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note?: string;
}): Promise<SavedRepositoryEntry> {
  try {
    const created = await createSavedRepository(params);
    return toEntry(created);
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw ApiError.conflict('This repository is already saved');
    }
    throw error;
  }
}

export async function listSavedRepositoriesForUser(
  userId: string,
): Promise<SavedRepositoryEntry[]> {
  const records = await findSavedRepositoriesByUser(userId);
  return records.map(toEntry);
}

export async function isRepositorySavedForUser(
  userId: string,
  repositoryFullName: string,
): Promise<boolean> {
  const existing = await findSavedRepositoryByUserAndFullName(userId, repositoryFullName);
  return existing !== null;
}

export async function unsaveRepositoryForUser(id: string, userId: string): Promise<void> {
  const deleted = await deleteSavedRepositoryByIdForUser(id, userId);

  if (!deleted) {
    throw ApiError.notFound('Saved repository not found');
  }
}
