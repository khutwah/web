import { BaseConstructorType } from '@/models/supabase/models/base'
import { createClient } from '@/utils/supabase/server'
import { createServerServiceRoleClient } from '@/utils/supabase/server-service-role'

type ClientInstance = ReturnType<typeof createClient> // Replace this with the actual type if known.

// Define generic types for the methods in `Base`.
export abstract class Base {
  supabase: ClientInstance

  constructor(args: BaseConstructorType = { keyType: 'anon' }) {
    const { keyType } = args
    if (keyType === 'anon') {
      this.supabase = createClient()
    } else {
      console.log('use service role please')
      this.supabase = createServerServiceRoleClient()
    }
  }
}
