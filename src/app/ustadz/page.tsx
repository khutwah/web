import { HalaqahCard } from '@/components/HalaqahCard/HalaqahCard'
import { Layout } from '@/components/Layouts/Ustadz'
import { Halaqah } from '@/utils/supabase/models/halaqah'
import { getUser } from '@/utils/supabase/get-user'
import { UstadzHomeHeader } from './components/UstadzHomeHeader'

export default async function Home() {
  const user = await getUser()

  const halaqah = new Halaqah()
  const halaqahList = await halaqah.list({ ustadz_id: user.data?.id })

  return (
    <Layout>
      <div className='w-full h-[218px] bg-mtmh-red-base absolute -z-10' />

      <div className='flex flex-col gap-y-6 p-6 mt-4'>
        <UstadzHomeHeader displayName={user.data?.name ?? ''} />

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

                const isOwner = defaultShift?.user.id === user.data?.id

                return (
                  <li key={item.id}>
                    <HalaqahCard
                      id={item.id}
                      name={item.name!}
                      venue={effectiveShift?.location ?? ''}
                      substituteeName={
                        substituteeName &&
                        (isOwner
                          ? substituteeName
                          : defaultShift?.user.name || '')
                      }
                      isOwner={isOwner}
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
