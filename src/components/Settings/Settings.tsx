import Logo from '@/components/Logo'
import { LogoutButton } from './LogoutButton'
import { PropsWithChildren } from 'react'

export function SettingsSharedContent({ children }: PropsWithChildren) {
  return (
    <>
      <div className='w-full h-[218px] bg-khutwah-red-base absolute -z-10' />

      <div className='p-4 text-khutwah-neutral-white text-khutwah-l-semibold'>
        Pengaturan
      </div>

      <div className='flex flex-1 flex-col p-6 gap-y-4 h-full justify-between'>
        <div className='flex flex-col gap-y-4 items-center'>
          <Logo variant='white' />

          <div className='text-khutwah-neutral-white text-khutwah-sm-regular'>
            App version: {process.env.NEXT_PUBLIC_APP_VERSION}
          </div>
        </div>

        <div>{children}</div>
        <LogoutButton />
      </div>
    </>
  )
}
