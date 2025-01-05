'use client'

import { Button } from '@/components/Button/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { Flame } from 'lucide-react'
import { useState } from 'react'
import { AddAsesmenForm } from '../AddAsesmenForm/AddAsesmenForm'
import { ROLE } from '@/models/auth'
import { StatusCheckpoint } from '@/models/checkpoints'

interface AddAsesmenProps {
  role: number
  sessionRangeId?: number
  checkpoint?: StatusCheckpoint
}

export function AddAsesmen({
  role,
  sessionRangeId,
  checkpoint
}: AddAsesmenProps) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='primary' className='w-full'>
          <Flame size={16} /> Mulai Asesmen
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Mulai Asesmen{' '}
            {role === ROLE.LAJNAH && sessionRangeId
              ? `${sessionRangeId} Juz`
              : ''}
          </DrawerTitle>
          <DrawerDescription>
            Tentukan jenis dan materi untuk memulai asesmen.
          </DrawerDescription>
        </DrawerHeader>
        <AddAsesmenForm
          role={role}
          sessionRangeId={sessionRangeId}
          checkpoint={checkpoint}
        />
      </DrawerContent>
    </Drawer>
  )
}
