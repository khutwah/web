import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/id'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('id')

export default function dayjsGmt7(initialDate = new Date()) {
  const time = dayjs(initialDate).utc().tz('Asia/Jakarta')
  return time
}
