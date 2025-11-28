import { PrismaClient } from "../generated/prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }; // stored PrismaClient inside global so it survives file reloads.

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  }); // if already exist use it if not create one

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// In Next.js, files can re-run many times due to hot reload and API calls.

// If PrismaClient is created every time, you may get the error:

// Error: Too many Prisma Clients are already running
