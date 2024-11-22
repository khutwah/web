import { Navbar } from './Navbar'

export function NavbarStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <Navbar
        withBackButton={false}
        text='Kelas 7 - Halaqah 1'
        onClickBackButton={() => {}}
      />
      <Navbar
        withBackButton
        text='Kelas 8 - Halaqah 1'
        onClickBackButton={() => {}}
      />
    </div>
  )
}
