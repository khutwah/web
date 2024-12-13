import dayjs from './dayjs'

export default function dayjsGmt7(
  stringDate: string = new Date().toISOString()
) {
  return dayjs.utc(stringDate).tz('Asia/Jakarta')
}
