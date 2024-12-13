import dayjs from './dayjs'

export default function dayjsClientSideLocal(
  stringDate: string = new Date().toISOString()
) {
  // See: https://day.js.org/docs/en/manipulate/local.
  return dayjs.utc(stringDate).local()
}
