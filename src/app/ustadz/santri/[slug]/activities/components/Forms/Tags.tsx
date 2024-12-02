import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { useTags } from '@/hooks/useTags'
import { PlusIcon, X } from 'lucide-react'
import { useState } from 'react'

interface TagsProps {
  tags: string[]
  onClick: (tag: string) => void
}

function TagPicker({ tags, onClick }: TagsProps) {
  const _tags = useTags()
  return (
    <div className='overflow-y-scroll max-h-[500px] py-3 px-4 flex flex-col gap-4'>
      {Object.entries(_tags).map(([key, value]) => {
        return (
          <div key={key} className='flex flex-col gap-2'>
            <span className='text-mtmh-sm-regular'>{key}</span>
            <div className='flex flex-row flex-wrap gap-2'>
              {value.map((tag) => (
                <button
                  onClick={() => onClick(tag)}
                  data-active={tags.includes(tag)}
                  key={tag}
                  className='py-1 px-2 bg-mtmh-snow-lighter data-[active=true]:bg-mtmh-primary-lightest text-mtmh-grey-base data-[active=true]:text-mtmh-primary-base flex flex-row gap-1 rounded-lg text-mtmh-sm-regular'
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TagsDrawer(props: TagsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          aria-expanded={open}
          className='rounded-lg py-1 px-2 bg-mtmh-snow-lightest flex flex-row items-center gap-1 text-mtmh-grey-base text-mtmh-sm-regular'
        >
          <PlusIcon size={12} />
          Tambah
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='hidden'>
          <DrawerTitle>Pilih penanda</DrawerTitle>
          <DrawerDescription>Pilih penanda aktivitas disini</DrawerDescription>
        </DrawerHeader>
        <TagPicker {...props} />
      </DrawerContent>
    </Drawer>
  )
}

export function Tags(props: TagsProps) {
  const { tags, onClick } = props
  return (
    <div className='flex flex-row flex-wrap	gap-1.5'>
      {tags.map((tag) => (
        <div
          key={tag}
          className='py-1 px-2 bg-mtmh-primary-lightest text-mtmh-primary-base flex flex-row gap-1 rounded-lg text-mtmh-sm-regular'
        >
          {tag}
          <button onClick={() => onClick(tag)}>
            <X size={12} />
          </button>
        </div>
      ))}
      <TagsDrawer {...props} />
    </div>
  )
}
