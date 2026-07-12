import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

// Prevent multiple PrismaClient instances in development (hot reload safety)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.nodeEnv !== 'production') {
  global.__prisma = prisma;
}