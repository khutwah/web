import { Halaqah } from '@/utils/supabase/models/halaqah'
import { type HalaqahItem, HalaqahList } from './HalaqahList'

export async function AllHalaqahList() {
  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list()

  let items: Array<HalaqahItem> = []

  if (halaqahList.kind === 'ustadz') {
    items = halaqahList.data
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
