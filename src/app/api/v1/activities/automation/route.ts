import isBetween from 'dayjs/plugin/isBetween'
import publicHolidays from '@/data/holidays/public.json'
import generalHolidays from '@/data/holidays/general.json'
import studentHolidays from '@/data/holidays/students.json'

import { doApiAction } from '@/utils/api-operation'
import { createSuccessResponse } from '@/utils/api/response-generator'
import { Activities } from '@/utils/supabase/models/activities'
import dayjs from 'dayjs'
import { Students } from '@/utils/supabase/models/students'

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

export async function POST() {
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

      const studentsInstance = new Students()
      const studentsData = await studentsInstance.listWithoutCheckpoints()

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

      console.log(students)

      //   const activitiesInstance = new Activities()

      //   activitiesInstance.createBulk(
      //     students.map((student) => {
      //       return {
      //         student_id: student.id
      //       }
      //     })
      //   )

      return DEFAULT_RETURN_TYPE
    }
  )
}
