import { createClient } from '@/utils/supabase/server'
import { PrismaClient } from '@prisma/client'

type ClientInstance = ReturnType<typeof createClient> // Replace this with the actual type if known.

const prisma = new PrismaClient()

// Define generic types for the methods in `Base`.
export abstract class Base {
  supabase: ClientInstance
  prisma: PrismaClient

  constructor() {
    this.supabase = createClient()
    this.prisma = prisma
  }
}
