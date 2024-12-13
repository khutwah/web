'use client'

import {
  CartesianGrid,
  Label,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot
} from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/Chart/Chart'
import { ActivityChartEntry, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/Tabs'
import dayjsClientSideLocal from '@/utils/dayjs-gmt7'
import { useState } from 'react'
import dayjs, { Dayjs } from '@/utils/dayjs'
import { useRouter } from 'next/navigation'
import { extractPathnameAndQueryFromURL } from '@/utils/url'

const CHART_CONFIG = {
  page_count_accumulation: {
    label: 'Jumlah halaman'
  },
  expected_total_page_count: {
    label: 'Target jumlah halaman'
  }
} satisfies ChartConfig
const LONGER_DATE_FORMAT = 'D MMMM YYYY'

export type ProgressChartPeriod = 'pekan' | 'bulan'

interface Props {
  activities: Array<ActivityChartEntry>
  datePeriod: ProgressChartPeriod
  onDatePeriodChange: (value: ProgressChartPeriod) => void
}

export function ProgressChart({
  activities,
  datePeriod,
  onDatePeriodChange
}: Props) {
  return (
    <>
      <Tabs
        defaultValue={datePeriod}
        onValueChange={(value) =>
          onDatePeriodChange(value as ProgressChartPeriod)
        }
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='pekan'>Pekan ini</TabsTrigger>
          <TabsTrigger value='bulan'>Bulan ini</TabsTrigger>
        </TabsList>

        <TabsContent value='pekan' className='py-6'>
          <Subchart activities={activities} datePeriod='pekan' />
        </TabsContent>

        <TabsContent value='bulan' className='py-6'>
          <Subchart activities={activities} datePeriod='bulan' />
        </TabsContent>
      </Tabs>
    </>
  )
}

interface ProgressChartWithNavigationProps
  extends Omit<Props, 'onDatePeriodChange'> {}

export function ProgressChartWithNavigation(
  props: ProgressChartWithNavigationProps
) {
  const router = useRouter()

  return (
    <ProgressChart
      {...props}
      onDatePeriodChange={(value) => {
        const url = new URL(window.location.href)
        if (value === 'pekan') {
          url.searchParams.delete('periode')
        } else {
          url.searchParams.set('periode', value)
        }

        router.replace(extractPathnameAndQueryFromURL(url))
      }}
    />
  )
}

// Helper function and components.
function Subchart({
  activities,
  datePeriod
}: Pick<Props, 'activities' | 'datePeriod'>) {
  const [currentDatetime] = useState(() =>
    // This is on client-side. Hence, new Date() here gets the data from the client, not the server.
    dayjsClientSideLocal(new Date().toISOString()).startOf(
      datePeriod === 'bulan' ? 'month' : 'week'
    )
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-mtmh-sm-regular'>
        Menampilkan pencapaian dari{' '}
        {formatChartTimerange(currentDatetime, datePeriod)}
      </div>

      <ChartContainer config={CHART_CONFIG}>
        <AreaChart
          accessibilityLayer
          data={activities}
          margin={{
            top: 18,
            left: 12,
            right: 18,
            bottom: 18
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='created_at'
            tickMargin={8}
            tick={{
              // fill-mtmh-grey-lightest
              fill: '#A2A2A2'
            }}
            tickFormatter={(value) => dayjsClientSideLocal(value).format('D/M')}
          >
            <Label value='Tanggal' position='insideBottom' offset={-10} />
          </XAxis>
          <YAxis
            // This is so that there are not too many whitespace on the Y-axis label.
            // Reference: https://github.com/recharts/recharts/issues/2027#issuecomment-2111387338.
            width={30}
            label={{
              value: 'Lembar total',
              angle: -90,
              position: 'left',
              style: { textAnchor: 'middle' }
            }}
            tick={{
              // fill-mtmh-grey-lightest
              fill: '#A2A2A2'
            }}
            stroke='transparent'
          />

          <ReferenceLine
            x={formatChartXAxis()}
            // stroke-mtmh-red-base
            stroke='#7F270F'
          />

          <ReferenceDot
            stroke='transparent'
            x={
              datePeriod === 'pekan'
                ? currentDatetime.endOf('week').startOf('day').toISOString()
                : currentDatetime.endOf('month').startOf('day').toISOString()
            }
            y={
              datePeriod === 'pekan'
                ? GLOBAL_TARGET_PAGE * 7
                : GLOBAL_TARGET_PAGE * currentDatetime.daysInMonth()
            }
            label={{
              value: 'Target',
              position: 'top',
              // fill-mtmh-grey-lightest
              fill: '#A2A2A2',
              offset: -5
            }}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
            labelFormatter={(label) => {
              return dayjs(label).format(LONGER_DATE_FORMAT)
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
            dataKey='target_page_count'
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
  if (datePeriod === 'pekan') {
    return `${datetime.startOf('week').format('D')}–${datetime.endOf('week').format(LONGER_DATE_FORMAT)}`
  }

  return `${datetime.startOf('month').format('D')}–${datetime.endOf('month').format(LONGER_DATE_FORMAT)}`
}

function formatChartXAxis(dateString?: string) {
  // This is on client-side. Hence, new Date() here gets the data from the client, not the server.
  return dayjsClientSideLocal(dateString || new Date().toISOString())
    .startOf('day')
    .toISOString()
}
