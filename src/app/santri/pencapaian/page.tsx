import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressChartPeriod } from '@/components/Progress/ProgressChart'
import { NoteListSection } from '@/app/santri/pencapaian/components/NoteListSection'
import ProgressChartSection from '@/app/santri/pencapaian/components/ProgressChartSection'

interface PencapaianProps {
  searchParams: Promise<{
    periode?: ProgressChartPeriod
  }>
}

export default async function Pencapaian({ searchParams }: PencapaianProps) {
  const { periode: periodParam } = await searchParams
  const period = periodParam === 'bulan' ? 'month' : 'week'

  return (
    <Layout>
      <Navbar text='Pencapaian' />

      <HeaderBackground height={112} />

      <div className='px-6 space-y-8 pb-8'>
        {/* TODO: restructure the page to seperate tabs from the chart and make it as a main navigation */}
        <ProgressChartSection period={periodParam ?? 'pekan'} />

        <NoteListSection period={period} />
      </div>
    </Layout>
  )
}
