'use client'

import { AssessmentCheckpointType } from '@/models/assessments'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '../Drawer/Drawer'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

interface AssessmentCheckpointDetailProps {
  id?: string
  isEditable?: boolean
  checkpoints: AssessmentCheckpointType[]
}

export function AssessmentCheckpointDetail({
  checkpoints
}: AssessmentCheckpointDetailProps) {
  const query = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const checkpointId = query.get('checkpoint')

  const checkpoint = checkpoints.find(
    (item) => item.id === Number(checkpointId)
  )

  const closeModal = () => {
    if (checkpoint) {
      const params = new URLSearchParams(query)
      params.delete('checkpoint')
      const _params = params.toString()
      router.replace(pathname + _params ? `?${_params}` : '')
    }
  }

  return (
    <Drawer open={Boolean(checkpoint)} onOpenChange={closeModal}>
      <DrawerContent>
        <DrawerHeader className='hidden'>
          <DrawerTitle>Checkpoint Drawer</DrawerTitle>
          <DrawerDescription>Checkpoint Drawer</DrawerDescription>
        </DrawerHeader>
        <div className='overflow-y-scroll max-h-[500px] flex flex-col p-5 gap-4'>
          {checkpoint?.timestamp}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
