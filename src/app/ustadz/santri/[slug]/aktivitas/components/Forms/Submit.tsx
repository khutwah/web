import { Button, ButtonProps } from '@/components/Button/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/Dialog/Dialog'
import { useState } from 'react'

export function Submit(props: ButtonProps) {
  const { onClick, ...rest } = props
  const [open, setOpen] = useState(false)

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button {...rest}>Simpan</Button>
      </DialogTrigger>
      <DialogContent className='bg-khutwah-neutral-white bottom-0 top-auto !translate-y-0'>
        <DialogHeader>
          <DialogTitle className='flex justify-between border-b border-khutwah-neutral-30 pb-2'>
            Antum yakin ingin melanjutkan?
          </DialogTitle>
          <DialogDescription className='!mt-3'>
            Pastikan semua informasi yang antum masukkan sudah benar sebelum
            melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-2 flex flex-row gap-4 items-center'>
          <Button
            variant='primary'
            onClick={(e) => {
              onClick?.(e)
              setOpen(false)
            }}
            className='basis-1/2'
          >
            Yakin
          </Button>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            className='basis-1/2'
          >
            Kembali
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
