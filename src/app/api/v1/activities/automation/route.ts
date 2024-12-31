import isBetween from 'dayjs/plugin/isBetween'
import publicHolidays from '@/data/holidays/public.json'
import generalHolidays from '@/data/holidays/general.json'
import studentHolidays from '@/data/holidays/students.json'

import { doApiAction } from '@/utils/api-operation'
import { createSuccessResponse } from '@/utils/api/response-generator'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'
import { Students } from '@/utils/supabase/models/students'
import {
  ActivityStatus,
  ActivityType,
  GLOBAL_TARGET_PAGE
} from '@/models/activities'
import { ApiError } from '@/utils/api-error'

dayjs.extend(isBetween)

const DEFAULT_RETURN_TYPE = {
  data: createSuccessResponse({
    data: null
  }),
  status: 200
}

type StudentHolidays = Array<
  [
    string,
    {
      student_id: number
      reason: string
    }
  ]
>

export async function GET() {
  return await doApiAction<ReturnType<typeof createSuccessResponse>>(
    async () => {
      const currentDate = dayjs()

      const isHoliday = [
        ...Object.keys(publicHolidays),
        ...Object.keys(generalHolidays)
      ].some((holiday) => {
        const start = dayjs(holiday)
        const end = start.endOf('day')

        return currentDate.isBetween(start, end)
      })

      if (isHoliday) {
        return DEFAULT_RETURN_TYPE
      }

      const studentsInstance = new Students({ keyType: 'service-role' })
      const studentsData = await studentsInstance.listForDraftSabaqAutomation()

      let students = studentsData.data ?? []

      const holidays = Object.entries(studentHolidays).filter((holiday) => {
        const date = dayjs(holiday[0])
        return dayjs().isBetween(dayjs(date), date.endOf('day'))
      }) as StudentHolidays

      students = students.filter((student) => {
        const isStudentHoliday = holidays.some((data) => {
          return data[1].student_id === student.id
        })

        return !isStudentHoliday
      })

      const activitiesInstance = new Activities({ keyType: 'service-role' })

      const response = await activitiesInstance.createBulk(
        students.map((student) => {
          return {
            student_id: student.id,
            shift_id: student.shift_id,
            type: ActivityType.Sabaq,
            is_target_achieved: false,
            notes: 'Draft Sabaq ini dibuat otomatis, mohon segera dilengkapi.',
            tags: [],
            status: ActivityStatus.draft,
            student_attendance: 'present',
            target_page_count: GLOBAL_TARGET_PAGE,
            page_count: 0,
            created_by: student.shift_ustadz_id!
          }
        })
      )

      if (response.error) {
        throw new ApiError({
          code: response.error.code,
          status: 500,
          message: response.error.message
        })
      }

      return DEFAULT_RETURN_TYPE
    }
  )
}
