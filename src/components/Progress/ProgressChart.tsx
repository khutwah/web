'use client'

import { CartesianGrid, Label, Area, AreaChart, XAxis, YAxis } from 'recharts'

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
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

const CHART_CONFIG = {
  page_count: {
    label: 'Jumlah halaman'
  },
  expected_total_page_count: {
    label: 'Target jumlah halaman'
  }
} satisfies ChartConfig
const LONGER_DATE_FORMAT = 'D MMMM YYYY'

const DEFAULT_ARRAY: ActivityEntry[] = []

interface Props {
  activities: Array<Omit<ActivityEntry, 'target_page_count'>> | null
  dateControlsContainerId: string
  datePeriod: 'week' | 'month'
  onDatePeriodChange: (value: 'week' | 'month') => void
}

export function ProgressChart({
  activities: activitiesProp,
  dateControlsContainerId,
  datePeriod,
  onDatePeriodChange
}: Props) {
  const activities = activitiesProp ?? DEFAULT_ARRAY

  return (
    <>
      <UniversalPortal selector={`#${dateControlsContainerId}`}>
        <Tabs
          defaultValue='week'
          onValueChange={(value) =>
            onDatePeriodChange(value as 'week' | 'month')
          }
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='week'>Pekan ini</TabsTrigger>
            <TabsTrigger value='month'>Bulan ini</TabsTrigger>
          </TabsList>

          {/* <TabsContent value='week'>
          <Subchart data={activities} datePeriod={datePeriod} />
          </TabsContent>
          
          <TabsContent value='month'>
          <Subchart data={activities} datePeriod={datePeriod} />
          </TabsContent> */}
        </Tabs>
      </UniversalPortal>
    </>
  )
}

function Subchart({
  data: dataProp,
  datePeriod
}: {
  data: NonNullable<Props['activities']>
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
        <AreaChart
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
          <YAxis
            // This is so that there are not too many whitespace on the Y-axis label.
            // Reference: https://github.com/recharts/recharts/issues/2027#issuecomment-2111387338.
            width={30}
            label={{
              value:
                datePeriod === 'week' ? 'Lembar pekan ini' : 'Lembar bulan ini',
              angle: -90,
              position: 'left',
              style: { textAnchor: 'middle' }
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
            labelFormatter={(label) => {
              return dayjsGmt7(new Date(label)).format(LONGER_DATE_FORMAT)
            }}
          />
          <Area
            dataKey='page_count'
            // stroke-mtmh-primary-base
            stroke='#0065FF'
            strokeWidth={2}
            dot={false}
            fill='#0065FF30'
          />
          <Area
            dataKey='expected_total_page_count'
            // stroke-mtmh-grey-lightest
            stroke='#A2A2A2'
            strokeWidth={2}
            // Expected to repeat, if we only put single entry it will not render the dashes after animation finishes.
            // Reference: https://github.com/recharts/recharts/issues/3588.
            strokeDasharray='6px 6px'
            dot={false}
            fill='transparent'
          />
        </AreaChart>
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
    return `${datetime.startOf('week').format('D')}–${datetime.endOf('week').format(LONGER_DATE_FORMAT)}`
  }

  return `${datetime.startOf('month').format('D')}–${datetime.endOf('month').format(LONGER_DATE_FORMAT)}`
}
