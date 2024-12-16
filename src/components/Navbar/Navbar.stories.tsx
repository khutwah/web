import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Navbar } from './Navbar'

export function NavbarStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <Navbar text='Kelas 7 - Halaqah 1' />
      <Navbar text='Kelas 8 - Halaqah 1' />
      <Navbar text='Kelas 9 - Halaqah 1' rightComponent={<XMarkIcon />} />
      <Navbar
        text='Kelas 9 - Halaqah 1'
        rightComponent={<ChatBubbleLeftRightIcon />}
      />
    </div>
  )
}
