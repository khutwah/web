import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layout/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressChartPeriod } from '@/components/Progress/ProgressChart'
import { NoteListSection } from '@/app/santri/pencapaian/components/NoteListSection'
import ProgressChartSection from '@/app/santri/pencapaian/components/ProgressChartSection'

interface PencapaianProps {
  searchParams: Promise<{
    period?: ProgressChartPeriod
  }>
}

export default async function Pencapaian({ searchParams }: PencapaianProps) {
  const { period } = await searchParams

  return (
    <Layout>
      <Navbar text='Pencapaian' />

      <HeaderBackground height={112} />

      <div className='px-6 space-y-8 pb-8'>
        {/* TODO: restructure the page to separate tabs from the chart and make it as a main navigation */}
        <ProgressChartSection period={period ?? 'week'} />

        <NoteListSection period={period ?? 'week'} />
      </div>
    </Layout>
  )
}
