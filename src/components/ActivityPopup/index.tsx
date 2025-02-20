'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '../Drawer/Drawer'
import { Activities } from '@/utils/supabase/models/activities'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { ActivityTypeKey, ActivityStatus } from '@/models/activities'
import dayjsClientSideLocal from '@/utils/dayjs-client-side-local'
import { MoveRight } from 'lucide-react'
import { Labels } from '../ActivityCard/ActivityCard'
import { Button } from '../Button/Button'
import Link from 'next/link'
import { addQueryParams } from '@/utils/url'

interface Props {
  activities: Awaited<ReturnType<Activities['list']>>['data']
  from?: string
  id?: string
  isEditable?: boolean
}

export function ActivityPopup({ activities, from, id, isEditable }: Props) {
  const query = useSearchParams()
  const router = useRouter()

  const activity = query.get('activity')

  const pathname = usePathname()

  const closeModal = () => {
    if (activity) {
      const params = new URLSearchParams(query)
      params.delete('activity')
      const _params = params.toString()
      router.replace(pathname + _params ? `?${_params}` : '')
    }
  }

  const _activity = activities?.find((item) => item.id === Number(activity))

  return (
    <Drawer open={Boolean(_activity)} onOpenChange={closeModal}>
      <DrawerContent>
        <DrawerHeader className='hidden'>
          <DrawerTitle>Activity Drawer</DrawerTitle>
          <DrawerDescription>Activity Drawer</DrawerDescription>
        </DrawerHeader>
        {_activity && (
          <div className='overflow-y-scroll max-h-[500px] flex flex-col p-5 gap-4'>
            <div className='flex flex-row items-start justify-between'>
              <div className='text-xs text-khutwah-neutral-50'>
                {/* WARNING: _activity.created_at is in UTC */}
                {dayjsClientSideLocal(_activity.created_at ?? '').format(
                  'dddd, DD MMM YYYY. HH:mm'
                )}
              </div>
              <ActivityBadge
                type={_activity.type as ActivityTypeKey}
                attendance={
                  _activity.student_attendance as 'present' | 'absent'
                }
                isDraft={_activity.status === ActivityStatus.draft}
                text={
                  _activity.student_attendance === 'present'
                    ? undefined
                    : `Tidak Setoran ${_activity.type as ActivityTypeKey}`
                }
              />
            </div>

            {_activity.student_attendance === 'present' && (
              <div className='flex flex-col gap-1'>
                <div className='text-xs text-khutwah-neutral-50'>Setoran</div>
                <div className='flex flex-row items-center space-x-4 text-sm'>
                  {_activity.start_surah && _activity.start_verse ? (
                    <>
                      <div>
                        {_activity.start_surah}: {_activity.start_verse}
                      </div>

                      <div>
                        <MoveRight size={16} />
                      </div>
                    </>
                  ) : null}

                  <div>
                    {_activity.end_surah}: {_activity.end_verse}
                  </div>
                </div>
              </div>
            )}

            {_activity.student_attendance === 'present' && (
              <div className='flex flex-col gap-1'>
                <div className='text-xs text-khutwah-neutral-50'>Jumlah</div>
                <div className='text-sm'>{_activity.page_count} Halaman</div>
              </div>
            )}

            {Boolean(_activity.tags) && (
              <Labels labels={_activity.tags as string[]} />
            )}

            <div className='flex flex-col gap-1'>
              <div className='text-xs text-khutwah-neutral-50'>
                {_activity.student_attendance === 'present'
                  ? 'Catatan'
                  : 'Alasan'}
              </div>
              <div className='text-sm'>{_activity.notes}</div>
            </div>

            {isEditable && (
              <>
                {_activity.status === ActivityStatus.draft ? (
                  <Button
                    variant='primary'
                    asChild
                    className='mt-4'
                    disabled={!_activity.has_edit_access}
                  >
                    {_activity.has_edit_access ? (
                      <Link
                        href={addQueryParams(
                          `/ustadz/santri/${_activity.student_id}/aktivitas/edit/${_activity.id}`,
                          {
                            from,
                            id: addQueryParams(id || '', {
                              activity: `${_activity.id}`
                            })
                          }
                        )}
                      >
                        Lanjutkan Melengkapi
                      </Link>
                    ) : (
                      <button
                        type='button'
                        disabled={!_activity.has_edit_access}
                      >
                        Afwan. Antum tidak punya hak edit.
                      </button>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    asChild
                    className='mt-4'
                    disabled={!_activity.has_edit_access}
                  >
                    {_activity.has_edit_access ? (
                      <Link
                        href={addQueryParams(
                          `/ustadz/santri/${_activity.student_id}`,
                          {
                            draft: 'true',
                            activity: `${_activity.id}`,
                            from,
                            id: addQueryParams(id || '', {
                              activity: `${_activity.id}`
                            })
                          }
                        )}
                      >
                        Jadikan Draft
                      </Link>
                    ) : (
                      <button
                        type='button'
                        disabled={!_activity.has_edit_access}
                      >
                        Afwan. Antum tidak punya hak edit.
                      </button>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
