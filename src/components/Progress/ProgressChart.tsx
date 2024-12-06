'use client'

import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/Chart/Chart'
import { ActivityEntry, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { UniversalPortal } from '@jesstelford/react-portal-universal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/Tabs'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

const CHART_CONFIG = {
  page_count: {
    label: 'Jumlah halaman'
  },
  expected_total_page_count: {
    label: 'Target jumlah halaman'
  }
} satisfies ChartConfig

export const PROGRESS_CHART_DATE_CONTROLS_PORTAL_ID =
  'progress-chart-date-controls'

const DEFAULT_ARRAY: ActivityEntry[] = []

interface Props {
  activities: Array<Omit<ActivityEntry, 'target_page_count'>> | null
  datePeriod: 'week' | 'month'
  onDatePeriodChange: (value: 'week' | 'month') => void
}

export function ProgressChart({
  activities: activitiesProp,
  datePeriod,
  onDatePeriodChange
}: Props) {
  const activities = activitiesProp ?? DEFAULT_ARRAY

  return (
    <>
      <Tabs
        defaultValue='week'
        onValueChange={(value) => onDatePeriodChange(value as 'week' | 'month')}
      >
        <UniversalPortal
          selector={`#${PROGRESS_CHART_DATE_CONTROLS_PORTAL_ID}`}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='week'>Pekan ini</TabsTrigger>
            <TabsTrigger value='month'>Bulan ini</TabsTrigger>
          </TabsList>
        </UniversalPortal>

        <TabsContent value='week'>
          <Subchart data={activities} datePeriod={datePeriod} />
        </TabsContent>

        <TabsContent value='month'>
          <Subchart data={activities} datePeriod={datePeriod} />
        </TabsContent>
      </Tabs>
    </>
  )
}

function Subchart({
  data: dataProp,
  datePeriod
}: {
  data: any[]
  datePeriod: Props['datePeriod']
}) {
  const [currentDatetime] = useState(() => dayjsGmt7())

  const data = dataProp.map((el, index) => ({
    ...el,
    expected_total_page_count: (index + 1) * GLOBAL_TARGET_PAGE
  }))

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-mtmh-sm-regular'>
        Menampilkan pencapaian dari{' '}
        {formatChartTimerange(currentDatetime, datePeriod)}
      </div>

      <ChartContainer config={CHART_CONFIG}>
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='created_at'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => dayjsGmt7(value).format('D/M')}
          >
            <Label value='Tanggal' position='bottom' />
          </XAxis>
          <YAxis>
            <Label
              value={
                datePeriod === 'week' ? 'Lembar pekan ini' : 'Lembar bulan ini'
              }
              angle={-90}
              position='center'
            />
          </YAxis>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey='page_count'
            type='monotone'
            className='stroke-mtmh-primary-base'
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey='expected_total_page_count'
            type='monotone'
            className='stroke-mtmh-grey-lighter'
            strokeWidth={2}
            strokeDasharray={8}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function formatChartTimerange(
  datetime: Dayjs,
  datePeriod: Props['datePeriod']
) {
  // Dev's note: the en-dash is intended to indicate range rather than hyphen (-).
  if (datePeriod === 'week') {
    return `${datetime.startOf('week').format('D')}–${datetime.endOf('week').format('D MMMM YYYY')}`
  }

  return `${datetime.startOf('month').format('D')}–${datetime.endOf('month').format('D MMMM YYYY')}`
}
