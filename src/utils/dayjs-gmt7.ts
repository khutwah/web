import dayjs from './dayjs'

export default function dayjsGmt7(initialDate = new Date()) {
  const time = dayjs(initialDate).utc().tz('Asia/Jakarta')
  return time
}
