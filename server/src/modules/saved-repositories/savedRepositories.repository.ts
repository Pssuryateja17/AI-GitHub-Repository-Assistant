import { Prisma, SavedRepository } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export interface CreateSavedRepositoryParams {
  userId: string;
  repositoryFullName: string;
  repositoryUrl: string;
  note?: string;
}

export async function createSavedRepository(
  params: CreateSavedRepositoryParams,
): Promise<SavedRepository> {
  return prisma.savedRepository.create({
    data: {
      userId: params.userId,
      repositoryFullName: params.repositoryFullName,
      repositoryUrl: params.repositoryUrl,
      note: params.note,
    },
  });
}

export async function findSavedRepositoriesByUser(userId: string): Promise<SavedRepository[]> {
  return prisma.savedRepository.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findSavedRepositoryByUserAndFullName(
  userId: string,
  repositoryFullName: string,
): Promise<SavedRepository | null> {
  return prisma.savedRepository.findUnique({
    where: {
      userId_repositoryFullName: {
        userId,
        repositoryFullName,
      },
    },
  });
}

export async function findSavedRepositoryByIdForUser(
  id: string,
  userId: string,
): Promise<SavedRepository | null> {
  return prisma.savedRepository.findFirst({
    where: { id, userId },
  });
}

export async function deleteSavedRepositoryByIdForUser(
  id: string,
  userId: string,
): Promise<SavedRepository | null> {
  const existing = await findSavedRepositoryByIdForUser(id, userId);

  if (!existing) {
    return null;
  }

  return prisma.savedRepository.delete({ where: { id } });
}

export function isUniqueConstraintViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
