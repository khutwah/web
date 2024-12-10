import { getUser } from '@/utils/supabase/get-user'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { type HalaqahItem, HalaqahList } from './HalaqahList'

export async function YourHalaqahList() {
  const user = await getUser()
  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list({ ustadz_id: user.data?.id })

  let items: Array<HalaqahItem> = []

  if (halaqahList.kind === 'ustadz') {
    items = halaqahList.data.map((item) => {
      const defaultShift = item.shifts.find((shift) => shift.end_date === null)
      const replacementShift = item.shifts.find(
        (shift) => shift.end_date !== null
      )
      const effectiveShift = replacementShift ?? defaultShift

      const substituteeName = replacementShift?.user.name ?? undefined

      const isOwner = defaultShift?.user.id === user.data?.id

      return {
        id: item.id,
        name: item.name ?? '',
        venue: effectiveShift?.location ?? '',
        substituteeName:
          substituteeName &&
          (isOwner ? substituteeName : defaultShift?.user.name || ''),
        isOwner
      }
    })
  }

  return <HalaqahList items={items} />
}
