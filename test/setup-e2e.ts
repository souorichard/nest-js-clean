import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url
}

const schemaId = randomUUID()

beforeEach(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)

  process.env.DATABASE_URL = databaseUrl.toString()

  execSync('pnpm prisma migrate deploy')
})

afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF NOT EXISTS "${schemaId}" CASCADE`
  )

  await prisma.$disconnect()
})
