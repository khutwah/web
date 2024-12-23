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
import { AddLajnahForm } from '../AddLajnahForm/AddLajnahForm'

export function AddLajnah() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='primary' className='w-full'>
          <Flame size={16} /> Mulai Lajnah
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Mulai Lajnah</DrawerTitle>
          <DrawerDescription>
            Isi data berikut untuk memulai lajnah.
          </DrawerDescription>
        </DrawerHeader>
        <AddLajnahForm />
      </DrawerContent>
    </Drawer>
  )
}
