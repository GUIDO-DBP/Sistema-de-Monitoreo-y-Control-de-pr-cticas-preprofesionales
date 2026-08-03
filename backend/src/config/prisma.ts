import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  // Allow global caching in development to avoid exhausting DB connections
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: env.isDevelopment()
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });
}

// Singleton: reuse existing client in development (hot reload safe)
export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (env.isDevelopment()) {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log('✅ Database connected');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('Database disconnected');
}
