import { default as _dayjs } from 'dayjs'
import 'dayjs/locale/id'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import minMax from 'dayjs/plugin/minMax'

_dayjs.extend(localizedFormat)
_dayjs.extend(isBetween)
_dayjs.extend(minMax)
_dayjs.extend(utc)
_dayjs.extend(timezone)
_dayjs.locale('id')

export { Dayjs } from 'dayjs'
export const dayjs = _dayjs
export default _dayjs
