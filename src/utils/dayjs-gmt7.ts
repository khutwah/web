import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function dayjsGmt7(initialDate = new Date()) {
  const time = dayjs(initialDate).utc().tz('Asia/Jakarta')
  return time
}
