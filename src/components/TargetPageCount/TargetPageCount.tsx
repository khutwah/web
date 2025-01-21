'use client'

import { Badge } from '@/components/Badge/Badge'
import { Pencil } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { useState } from 'react'
import { TargetPageCountDrawer } from './TargetPageCountDrawer'

interface TargetPageCountProps {
  studentId?: number
  circleId?: number
  activityId?: number
  targetPageCount: number
  editable?: boolean
  isReview?: boolean
}

export function TargetPageCount({
  studentId,
  circleId,
  activityId,
  targetPageCount,
  editable,
  isReview
}: TargetPageCountProps) {
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button disabled={!editable}>
          <Badge
            color='blue-outline'
            text={`${targetPageCount} halaman`}
            icon={editable && <Pencil size={12} />}
          />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-left'>Target Halaman</DrawerTitle>
          <DrawerDescription className='hidden'>
            Target Halaman
          </DrawerDescription>
        </DrawerHeader>
        <TargetPageCountDrawer
          activityId={activityId}
          studentId={studentId}
          circleId={circleId}
          editable={editable}
          targetPageCount={targetPageCount}
          isReview={isReview}
          onFinish={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  )
}
