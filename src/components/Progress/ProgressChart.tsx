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
import { ActivityEntry, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/Tabs'
import dayjsGmt7 from '@/utils/dayjs-gmt7'
import { useState } from 'react'
import dayjs, { Dayjs } from '@/utils/dayjs'

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

interface Props {
  activities: Array<ActivityEntry> | null
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
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='week'>Pekan ini</TabsTrigger>
          <TabsTrigger value='month'>Bulan ini</TabsTrigger>
        </TabsList>

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
  const [currentDatetime] = useState(() => dayjsGmt7())

  const dayToActivityRecord = getInitialChartData(datePeriod)
  let currentPageCountAccumulation = 0

  for (let i = 0; i < dataProp.length; i++) {
    const activity = dataProp[i]
    if (!activity.created_at) continue

    const xAxisValue = formatChartXAxis(activity.created_at)
    const recordValue = dayToActivityRecord[xAxisValue]

    if (!recordValue || activity.student_attendance === 'absent') continue

    currentPageCountAccumulation += activity.page_count ?? 0

    recordValue.page_count_accumulation = currentPageCountAccumulation
  }

  const data: ActivityChartEntry[] = Object.values(dayToActivityRecord)

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
            top: 18,
            left: 12,
            right: 18,
            bottom: 18
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='created_at'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              // fill-mtmh-grey-lightest
              fill: '#A2A2A2'
            }}
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
              datePeriod === 'week'
                ? currentDatetime.endOf('week').startOf('day').toISOString()
                : currentDatetime.endOf('month').startOf('day').toISOString()
            }
            y={
              datePeriod === 'week'
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
  datetime: typeof Dayjs,
  datePeriod: Props['datePeriod']
) {
  // Dev's note: the en-dash is intended to indicate range rather than hyphen (-).
  if (datePeriod === 'week') {
    return `${datetime.startOf('week').format('D')}–${datetime.endOf('week').format(LONGER_DATE_FORMAT)}`
  }

  return `${datetime.startOf('month').format('D')}–${datetime.endOf('month').format(LONGER_DATE_FORMAT)}`
}

function formatChartXAxis(dateString?: string) {
  return dayjsGmt7(dateString ? new Date(dateString) : undefined)
    .startOf('day')
    .toISOString()
}

function getInitialChartData(datePeriod: Props['datePeriod']) {
  const record: Record<string, ActivityChartEntry> = {}
  let expectedTotalPageCount = 0
  let it: Dayjs
  let end: Dayjs

  if (datePeriod === 'week') {
    it = dayjsGmt7().startOf('week')
    end = dayjsGmt7().endOf('week')
  } else {
    it = dayjsGmt7().startOf('month')
    end = dayjsGmt7().endOf('month')
  }

  while (it.isBefore(end)) {
    // This is only used in the chart, so it's okay if we "abuse" this.
    const createdAt = formatChartXAxis(it.toString())
    expectedTotalPageCount += 4

    record[createdAt] = {
      page_count: null,
      created_at: createdAt,
      expected_total_page_count: expectedTotalPageCount,
      page_count_accumulation: null,
      // Mostly default values.
      type: 'Sabaq',
      target_page_count: GLOBAL_TARGET_PAGE,
      student_attendance: 'present',
      end_surah: '',
      end_surah_id: -1,
      end_verse: -1,
      halaqah_name: undefined,
      id: -1,
      notes: '',
      start_surah: '',
      start_surah_id: -1,
      start_verse: -1,
      status: '',
      student_id: undefined,
      student_name: undefined,
      tags: []
    }

    it = it.add(1, 'day')
  }

  return record
}
