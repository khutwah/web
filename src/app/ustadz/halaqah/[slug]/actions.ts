'use server'

import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { redirect } from 'next/navigation'

export async function navigateToHalaqahList() {
  redirect(MENU_USTADZ_PATH_RECORDS.halaqah)
}
