import { GreetingsCard } from '@/components/GreetingsCard/GreetingsCard'
import { HalaqahCard } from '@/components/HalaqahCard/HalaqahCard'
import { Layout } from '@/components/Layouts/Ustadz'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import StubAvatarImage from '@/assets/sample-ustadz-photo.png'
import { getUser } from '@/utils/supabase/get-user'

export default async function Home() {
  const user = await getUser()

  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list({ ustadz_id: user.data?.id })

  return (
    <Layout>
      <div className='w-full h-[218px] bg-mtmh-red-base absolute' />

      <div className='flex flex-col gap-y-6 p-6 mt-28'>
        <GreetingsCard
          className='z-10'
          avatarUrl={StubAvatarImage}
          name={user.data?.name ?? ''}
          salahPrayerTimes={{
            // TODO(imballinst): integrate with external API later.
            imsak: '03:56',
            subuh: '04:06',
            terbit: '05:20',
            dhuha: '05:48',
            dzuhur: '11:37',
            ashar: '14:52',
            maghrib: '17:47',
            isya: '18:59'
          }}
        />

        <section className='flex flex-col gap-y-3'>
          <h2 className='text-mtmh-m-semibold'>Halaqah Hari Ini</h2>

          {halaqahList?.kind === 'ustadz' && (
            <ul className='flex flex-col gap-y-3'>
              {halaqahList.data.map((item) => {
                const defaultShift = item.shifts.find(
                  (shift) => shift.end_date === null
                )
                const replacementShift = item.shifts.find(
                  (shift) => shift.end_date !== null
                )
                const effectiveShift = replacementShift ?? defaultShift

                const substituteeName = replacementShift?.user.name ?? undefined

                return (
                  <li key={item.id}>
                    <HalaqahCard
                      name={item.name!}
                      venue={effectiveShift?.location ?? ''}
                      substituteeName={substituteeName}
                      hasGutter
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  )
}
