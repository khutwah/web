import { default as _dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import updateLocale from 'dayjs/plugin/updateLocale'

import 'dayjs/locale/id'

_dayjs.extend(utc)
_dayjs.extend(timezone)
_dayjs.extend(isSameOrAfter)
_dayjs.extend(updateLocale)

_dayjs.updateLocale('id', {
  weekdays: ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
})
_dayjs.locale('id')

export { Dayjs } from 'dayjs'
export const dayjs = _dayjs
export default _dayjs
