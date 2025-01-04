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
  id?: number
  circleId?: number
  targetPageCount: number
  editable?: boolean
}

export function TargetPageCount({
  id,
  circleId,
  targetPageCount,
  editable
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
          id={id}
          circleId={circleId}
          editable={editable}
          targetPageCount={targetPageCount}
          onFinish={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  )
}
