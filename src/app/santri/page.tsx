import { Layout } from '@/components/Layouts/Santri'
import { HeaderBackground } from '@/components/Header/Background'
import { HomeHeader } from '@/components/Home/Header'
import { getUser } from '@/utils/supabase/get-user'
import AgendaCard from '@/components/AgendaCard/AgendaCard'
import { StatsCard } from '@/components/StatsCard/StatsCard'

export default async function Home() {
  const user = await getUser()

  return (
    <Layout>
      <HeaderBackground />

      <div className='flex flex-col gap-y-6 mt-4 py-6'>
        <section className='px-6 gap-y-6 flex flex-col'>
          <HomeHeader displayName={user.data?.name ?? ''} />
        </section>
        <section className='flex flex-col gap-y-3 px-6'>
          <StatsCard />
        </section>
        <section className='flex flex-col gap-y-3 px-6'>
          <h2 className='text-mtmh-m-semibold'>Agenda Terdekat</h2>
          <ul className='flex flex-col gap-y-3'>
            <li>
              <AgendaCard
                id='1'
                category='parenting'
                title='Agar Anak Setangguh Nabi Yusuf'
                date='Rabu, 11 Des 2024'
                description='Saat itulah Nabi Yusuf Alaihissallam berlindung diri dengan Rabbnya, dan beliau memohon pertolongan kepada-Nya dari keburukan dan tipu-daya.'
              />
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  )
}
