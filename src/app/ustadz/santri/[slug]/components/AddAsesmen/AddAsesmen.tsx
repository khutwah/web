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

export function AddAsesmen() {
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
          <DrawerTitle>Mulai Asesmen</DrawerTitle>
          <DrawerDescription>
            Tentukan jenis dan materi untuk memulai asesmen.
          </DrawerDescription>
        </DrawerHeader>
        <AddAsesmenForm />
      </DrawerContent>
    </Drawer>
  )
}
