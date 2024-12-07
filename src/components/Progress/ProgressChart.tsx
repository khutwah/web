'use client'

import { CartesianGrid, Label, Area, AreaChart, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/Chart/Chart'
import { ActivityEntry, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/Tabs'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/id'
import { useRouter } from 'next/navigation'
import { extractPathnameAndQueryFromURL } from '@/utils/url'

dayjs.locale('id')

const CHART_CONFIG = {
  page_count_accumulation: {
    label: 'Jumlah halaman'
  },
  expected_total_page_count: {
    label: 'Target jumlah halaman'
  }
} satisfies ChartConfig
const LONGER_DATE_FORMAT = 'D MMMM YYYY'

const DEFAULT_ARRAY: ActivityEntry[] = []

export type ProgressChartPeriod = 'pekan' | 'bulan'

interface Props {
  activities: Array<ActivityEntry> | null
  datePeriod: ProgressChartPeriod
  onDatePeriodChange: (value: ProgressChartPeriod) => void
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
          <Subchart data={activities} datePeriod='pekan' />
        </TabsContent>

        <TabsContent value='bulan' className='py-6'>
          <Subchart data={activities} datePeriod='bulan' />
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
interface ActivityChartEntry extends ActivityEntry {
  page_count_accumulation: number | null
  expected_total_page_count: number
}

function Subchart({
  data: dataProp,
  datePeriod
}: {
  data: NonNullable<Props['activities']>
  datePeriod: Props['datePeriod']
}) {
  const [currentDatetime] = useState(() =>
    dayjsGmt7().startOf(datePeriod === 'bulan' ? 'month' : 'week')
  )

  const data: ActivityChartEntry[] = []
  let currentPageCountAccumulation = 0

  dataProp.forEach((activity, index) => {
    currentPageCountAccumulation += activity.page_count ?? 0

    data.push({
      ...activity,
      page_count_accumulation: currentPageCountAccumulation,
      expected_total_page_count: (index + 1) * GLOBAL_TARGET_PAGE
    })
  })

  const length = data.length
  const periodLength =
    datePeriod === 'bulan' ? currentDatetime.daysInMonth() : 7

  if (length < periodLength) {
    // Backfill the gaps.
    for (let i = length; i < periodLength; i++) {
      data.push({
        expected_total_page_count: (i + 1) * GLOBAL_TARGET_PAGE,
        page_count_accumulation: null,
        created_at: currentDatetime.add(i, 'days').toISOString(),
        // The rest are not really important.
        end_surah: '',
        end_surah_id: -1,
        end_verse: -1,
        halaqah_name: '',
        id: -1,
        notes: null,
        page_count: 0,
        start_surah: '',
        start_surah_id: -1,
        start_verse: -1,
        status: '',
        student_attendance: '',
        student_id: -1,
        student_name: null,
        tags: [],
        target_page_count: -1,
        type: ''
      })
    }
  }

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
            right: 12,
            bottom: 18
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='created_at'
            tickMargin={8}
            tickFormatter={(value) => dayjsGmt7(value).format('D/M')}
          >
            <Label value='Tanggal' position='insideBottom' offset={-10} />
          </XAxis>
          <YAxis
            // This is so that there are not too many whitespace on the Y-axis label.
            // Reference: https://github.com/recharts/recharts/issues/2027#issuecomment-2111387338.
            width={30}
            label={{
              value:
                datePeriod === 'pekan'
                  ? 'Lembar pekan ini'
                  : 'Lembar bulan ini',
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
            dataKey='page_count_accumulation'
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
  if (datePeriod === 'pekan') {
    return `${datetime.startOf('week').format('D')}–${datetime.endOf('week').format(LONGER_DATE_FORMAT)}`
  }

  return `${datetime.startOf('month').format('D')}–${datetime.endOf('month').format(LONGER_DATE_FORMAT)}`
}
