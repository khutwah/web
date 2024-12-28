import { Circles } from '@/utils/supabase/models/circles'
import { type HalaqahItem, HalaqahList } from './HalaqahList'

export async function AllHalaqahList() {
  const ciclesInstance = new Circles()
  const circles = await ciclesInstance.list()

  let items: Array<HalaqahItem> = []

  if (circles.kind === 'ustadz') {
    items = circles.data
      .filter((item) => {
        // Exclude halaqah with subtitutee
        return !item.shifts.some((shift) => shift.end_date !== null)
      })
      .map((item) => {
        const defaultShift = item.shifts.find(
          (shift) => shift.end_date === null
        )

        return {
          id: item.id,
          name: item.name ?? '',
          venue: defaultShift?.location ?? ''
        }
      })
  }

  return <HalaqahList items={items} />
}
