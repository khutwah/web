import { getUserRole } from '@/utils/supabase/get-user-role'
import { ROLE } from '@/models/auth'
import UstadzRole from './components/roles/UstadzRole'
import LajnahRole from './components/roles/LajnahRole'
import { DetailSantriProps } from '../models/detail-santri'

export default async function DetailSantri(props: DetailSantriProps) {
  const role = await getUserRole()
  return (
    <>
      {role === ROLE.USTADZ ? (
        <UstadzRole {...props} />
      ) : (
        <LajnahRole {...props} />
      )}
    </>
  )
}
