import { Card } from '@/components/Card/Card'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressViewToggle } from '../ProgressView/PorgressViewToggle'
import { StateMessage } from '@/components/StateMessage/StateMessage'

export default function ErrorMessage() {
  return (
    <>
      <Navbar
        text='Detail Santri'
        rightComponent={<ProgressViewToggle initialView={'grid'} isLoading />}
      />
      <div className='bg-khutwah-red-base w-full p-4 h-[225px] absolute -z-10' />
      <div className='flex flex-col p-6 gap-y-4'>
        <div className='flex justify-center gap-x-[6.5px] text-khutwah-neutral-white text-khutwah-m-regular'>
          <SantriActivityHeader />
        </div>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-md border border-khutwah-snow-lighter rounded-md mb-2'>
          <StateMessage
            className='py-8'
            description='Tidak dapat menampilkan data'
            title='Terjadi Kesalahan'
            type='error'
          />
        </Card>
      </div>
    </>
  )
}
