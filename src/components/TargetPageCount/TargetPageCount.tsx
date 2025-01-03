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
  id: number
  targetPageCount: number
}

export function TargetPageCount({ id, targetPageCount }: TargetPageCountProps) {
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button>
          <Badge
            color='blue-outline'
            text={`${targetPageCount} halaman`}
            icon={<Pencil size={12} />}
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
          targetPageCount={targetPageCount}
          onFinish={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  )
}
