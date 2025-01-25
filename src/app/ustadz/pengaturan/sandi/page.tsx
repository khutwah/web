import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { UpdatePassword } from './components/UpdatePassword'
import { updatePassword } from './actions'

export default function PengaturanSandi() {
  return (
    <Layout>
      <header className='sticky top-0 bg-khutwah-red-base'>
        <Navbar text='Ubah Sandi' />
      </header>
      <main className='flex flex-col gap-4 p-4'>
        <UpdatePassword action={updatePassword} />
      </main>
    </Layout>
  )
}
