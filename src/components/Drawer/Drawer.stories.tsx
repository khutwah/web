import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from './Drawer'

export function DrawerStory() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button aria-expanded={open} onClick={() => setOpen(true)}>
            open drawer
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer Description</DrawerDescription>
          </DrawerHeader>
          <div className='px-4 pb-16'>Drawer Content</div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
