'use server'

import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'
import { redirect } from 'next/navigation'

export async function navigateToHalaqahList() {
  redirect(MENU_PATH_RECORD.halaqah)
}
