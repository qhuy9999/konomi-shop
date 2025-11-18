import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const client = new PrismaClient()
  
  // Log if DATABASE_URL is not set (for debugging)
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  Warning: DATABASE_URL environment variable is not set. Prisma may fail to connect.')
  }
  
  return client
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma