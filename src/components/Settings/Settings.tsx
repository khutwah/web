import Logo from '@/assets/minhajul-haq-logo-white.png'

import Image from 'next/image'
import { LogoutButton } from './LogoutButton'
import { PropsWithChildren } from 'react'

export function SettingsSharedContent({ children }: PropsWithChildren) {
  return (
    <>
      <div className='w-full h-[218px] bg-mtmh-red-base absolute -z-10' />

      <div className='p-4 text-mtmh-neutral-white text-mtmh-l-semibold'>
        Pengaturan
      </div>

      <div className='flex flex-1 flex-col p-6 gap-y-4 h-full justify-between'>
        <div className='flex flex-col gap-y-4 items-center'>
          <Image alt='Minhajul Haq' src={Logo} width={121} />

          <div className='text-mtmh-neutral-white text-mtmh-sm-regular'>
            App version: {process.env.NEXT_PUBLIC_APP_VERSION}
          </div>
        </div>

        <div>{children}</div>
        <LogoutButton />
      </div>
    </>
  )
}
