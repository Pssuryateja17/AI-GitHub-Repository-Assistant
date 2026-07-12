import { Prisma } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import {
  countAnalysisHistoryByUser,
  createAnalysisHistoryEntry,
  deleteAnalysisHistoryByIdForUser,
  findAnalysisHistoryByIdForUser,
  findAnalysisHistoryByUser,
} from './history.repository';

export interface AnalysisHistoryEntry {
  id: string;
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: Prisma.JsonValue;
  analysis: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedHistoryResult {
  items: AnalysisHistoryEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function toEntry(record: {
  id: string;
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: Prisma.JsonValue;
  analysis: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}): AnalysisHistoryEntry {
  return {
    id: record.id,
    userId: record.userId,
    repositoryFullName: record.repositoryFullName,
    repositoryUrl: record.repositoryUrl,
    metadata: record.metadata,
    analysis: record.analysis,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function recordAnalysisHistory(params: {
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: Prisma.InputJsonValue;
  analysis: Prisma.InputJsonValue;
}): Promise<AnalysisHistoryEntry> {
  const created = await createAnalysisHistoryEntry(params);
  return toEntry(created);
}

export async function getAnalysisHistoryForUser(
  userId: string,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedHistoryResult> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
  const skip = (safePage - 1) * safePageSize;

  const [records, total] = await Promise.all([
    findAnalysisHistoryByUser(userId, { skip, take: safePageSize }),
    countAnalysisHistoryByUser(userId),
  ]);

  return {
    items: records.map(toEntry),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function getAnalysisHistoryEntry(
  id: string,
  userId: string,
): Promise<AnalysisHistoryEntry> {
  const record = await findAnalysisHistoryByIdForUser(id, userId);

  if (!record) {
    throw ApiError.notFound('Analysis history entry not found');
  }

  return toEntry(record);
}

export async function deleteAnalysisHistoryEntry(id: string, userId: string): Promise<void> {
  const deleted = await deleteAnalysisHistoryByIdForUser(id, userId);

  if (!deleted) {
    throw ApiError.notFound('Analysis history entry not found');
  }
}
