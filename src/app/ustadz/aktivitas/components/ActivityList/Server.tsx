import { ActivityListProps, LIMIT } from '@/models/activity-list'
import { getActivities } from '../../actions'
import { ActivityListClient } from './Client'
import getTimezoneInfo from '@/utils/get-timezone-info'
import { StateMessage } from '@/components/StateMessage/StateMessage'

export async function ActivityList(props: Readonly<ActivityListProps>) {
  const result = await getActivities({
    offset: 0,
    limit: LIMIT,
    filter: props
  })

  const tz = await getTimezoneInfo()

  if (!result.success) {
    return (
      <StateMessage
        className='my-14'
        description='Tidak dapat menampilkan data aktivitas'
        title='Terjadi Kesalahan'
        type='error'
      />
    )
  }

  if (result.data && !result.data.length) {
    return (
      <StateMessage
        className='my-14'
        description='Kami tidak dapat menemukan aktivitas santri yang Anda cari. Silakan periksa kembali pencarian Anda atau coba lagi nanti.'
        title='Aktivitas Santri Tidak Ditemukan'
        type='empty'
      />
    )
  }

  return (
    <div>
      <ActivityListClient tz={tz} initialActivities={result.data!} {...props} />
    </div>
  )
}
