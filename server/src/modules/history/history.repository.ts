import { AnalysisHistory, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export interface CreateAnalysisHistoryParams {
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  metadata: Prisma.InputJsonValue;
  analysis: Prisma.InputJsonValue;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export async function createAnalysisHistoryEntry(
  params: CreateAnalysisHistoryParams,
): Promise<AnalysisHistory> {
  return prisma.analysisHistory.create({
    data: {
      userId: params.userId,
      repositoryFullName: params.repositoryFullName,
      repositoryUrl: params.repositoryUrl,
      metadata: params.metadata,
      analysis: params.analysis,
    },
  });
}

export async function findAnalysisHistoryByUser(
  userId: string,
  pagination: PaginationParams,
): Promise<AnalysisHistory[]> {
  return prisma.analysisHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function countAnalysisHistoryByUser(userId: string): Promise<number> {
  return prisma.analysisHistory.count({ where: { userId } });
}

export async function findAnalysisHistoryByIdForUser(
  id: string,
  userId: string,
): Promise<AnalysisHistory | null> {
  return prisma.analysisHistory.findFirst({
    where: { id, userId },
  });
}

export async function deleteAnalysisHistoryByIdForUser(
  id: string,
  userId: string,
): Promise<AnalysisHistory | null> {
  const existing = await findAnalysisHistoryByIdForUser(id, userId);

  if (!existing) {
    return null;
  }

  return prisma.analysisHistory.delete({ where: { id } });
}
