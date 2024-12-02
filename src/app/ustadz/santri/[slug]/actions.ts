'use server'

import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'
import { redirect } from 'next/navigation'

export async function navigateToSantriList() {
  redirect(MENU_PATH_RECORD.santri)
}
