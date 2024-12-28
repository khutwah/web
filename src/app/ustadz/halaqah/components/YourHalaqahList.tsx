import { getUser } from '@/utils/supabase/get-user'
import { Circles } from '@/utils/supabase/models/circles'
import { type HalaqahItem, HalaqahList } from './HalaqahList'

export async function YourHalaqahList() {
  const user = await getUser()
  const circlesInstance = new Circles()
  const circles = await circlesInstance.list({ ustadz_id: user.data?.id })

  let items: Array<HalaqahItem> = []

  if (circles.kind === 'ustadz') {
    items = circles.data.map((item) => {
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
