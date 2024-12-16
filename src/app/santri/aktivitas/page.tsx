import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ActivityGridSection } from '@/app/santri/aktivitas/components/ActivityGridSection'
import { LatestActivitiesSection } from '@/app/santri/aktivitas/components/LatestActivitiesSection'

export default async function Aktivitas() {
  return (
    <Layout>
      <HeaderBackground />

      <Navbar text='Aktivitas' />

      <div className='px-6 space-y-8 pb-8'>
        <ActivityGridSection />

        <LatestActivitiesSection />
      </div>
    </Layout>
  )
}
