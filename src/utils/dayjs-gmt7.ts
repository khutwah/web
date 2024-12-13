import dayjs from './dayjs'

export default function dayjsGmt7(stringDate: string) {
  return dayjs.utc(stringDate).tz('Asia/Jakarta')
}
