import { PostgrestError } from '@supabase/supabase-js'
import { createClient } from '../server'

type ClientInstance = ReturnType<typeof createClient> // Replace this with the actual type if known

// Define generic types for the methods in `Base`
export abstract class Base {
  supabase: ClientInstance

  constructor() {
    this.supabase = createClient()
  }
}

export type ListReturnType<ReturnType> =
  | {
      data: ReturnType[]
      error: PostgrestError
      count: null
      status: number
      statusText: string
    }
  | {
      data: ReturnType[]
      error: null
      count: number | null
      status: number
      statusText: string
    }
