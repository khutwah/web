import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layout/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ActivityGridSection } from '@/app/santri/aktivitas/components/ActivityGridSection'
import { LatestActivitiesSection } from '@/app/santri/aktivitas/components/LatestActivitiesSection'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Aktivitas({ searchParams }: Props) {
  return (
    <Layout>
      <HeaderBackground />

      <Navbar text='Aktivitas' />

      <div className='px-6 space-y-8 pb-8'>
        <ActivityGridSection searchParams={searchParams} />

        <LatestActivitiesSection />
      </div>
    </Layout>
  )
}
