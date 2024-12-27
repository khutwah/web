import Logo from '@/components/Logo'
import { PropsWithChildren } from 'react'

export default async function GetStartedLayout({
  children
}: PropsWithChildren) {
  return (
    <main className='pt-12 px-4 pb-6 flex flex-col items-center'>
      <Logo variant='main' />

      <div className='w-full mt-10 flex flex-col gap-y-10'>{children}</div>
    </main>
  )
}
