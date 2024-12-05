import Logo from '@/assets/minhajul-haq-logo.png'
import Image from 'next/image'
import { PropsWithChildren } from 'react'

export default async function LoginLayout({ children }: PropsWithChildren) {
  return (
    <main className='pt-12 px-4 pb-6 flex flex-col items-center'>
      <Image alt='Minhajul Haq' src={Logo} width={227} height={65} />

      <div className='w-full mt-10 flex flex-col gap-y-10'>{children}</div>
    </main>
  )
}
