import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

async function bootstrap(): Promise<void> {
  const app = createApp();

  await prisma.$connect();
  logger.info('Connected to PostgreSQL database via Prisma');

  const server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server and database connections closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});