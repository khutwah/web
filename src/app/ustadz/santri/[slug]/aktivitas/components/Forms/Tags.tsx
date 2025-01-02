import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/Drawer/Drawer'
import { useTags } from '@/hooks/useTags'
import { TAG_LAJNAH_ASSESSMENT_ONGOING } from '@/models/checkpoints'
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
      {Object.entries(_tags).map(([key, value]) => (
        <div key={key} className='flex flex-col gap-2'>
          <span className='text-khutwah-sm-regular'>{key}</span>
          <div className='flex flex-row flex-wrap gap-2'>
            {value.map((tag) => (
              <label
                key={tag}
                data-active={tags.includes(tag)}
                className={`py-1 px-2 rounded-lg text-khutwah-sm-regular flex flex-row gap-1 cursor-pointer ${
                  tags.includes(tag)
                    ? 'bg-khutwah-primary-lightest text-khutwah-blue-base'
                    : 'bg-khutwah-snow-lighter text-khutwah-grey-base'
                }`}
              >
                <input
                  type='checkbox'
                  checked={tags.includes(tag)}
                  onChange={() => onClick(tag)}
                  className='sr-only' // Hidden for visuals, still accessible
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      ))}
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
          className='rounded-lg py-1 px-2 bg-khutwah-snow-lightest flex flex-row items-center gap-1 text-khutwah-grey-base text-khutwah-sm-regular'
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
    <div className='flex flex-row flex-wrap gap-1.5'>
      {tags
        .filter((tag) => tag !== TAG_LAJNAH_ASSESSMENT_ONGOING)
        .map((tag) => (
          <div
            key={tag}
            className='py-1 px-2 bg-khutwah-primary-lightest text-khutwah-blue-base flex flex-row gap-1 rounded-lg text-khutwah-sm-regular'
          >
            {tag}
            <button onClick={() => onClick(tag)}>
              <span className='sr-only'>remove tag</span>
              <X size={12} aria-hidden />
            </button>
          </div>
        ))}
      <TagsDrawer {...props} />
    </div>
  )
}
