import { MessageSquareText, X } from 'lucide-react'
import NavbarInternal from './NavbarInternal'

export function NavbarStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <NavbarInternal
        text='Kelas 7 - Halaqah 1'
        handleBackClick={console.log}
      />
      <NavbarInternal
        text='Kelas 8 - Halaqah 1'
        handleBackClick={console.log}
      />
      <NavbarInternal
        text='Kelas 9 - Halaqah 1'
        rightComponent={<X />}
        handleBackClick={console.log}
      />
      <NavbarInternal
        text='Kelas 9 - Halaqah 1'
        handleBackClick={console.log}
        rightComponent={<MessageSquareText />}
      />
    </div>
  )
}
