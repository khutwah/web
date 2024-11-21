import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function dayjsGmt7() {
  const time = dayjs.utc().tz('Asia/Jakarta')
  return time
}
