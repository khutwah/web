import { Button } from '@/components/Button/Button'
import { Layout } from '@/components/Layout/Ustadz'
import { SettingsSharedContent } from '@/components/Settings/Settings'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Pengaturan() {
  return (
    <Layout>
      <SettingsSharedContent>
        <div>
          <Button className='w-full' variant='outline' asChild>
            <Link
              href={`${MENU_USTADZ_PATH_RECORDS.home}/pengaturan/sandi`}
              className='flex items-center justify-between p-4'
            >
              <span className='text-khutwah-m-semibold'>Ubah Sandi</span>
              <ChevronRight className='text-khutwah-m-semibold' />
            </Link>
          </Button>
        </div>
      </SettingsSharedContent>
    </Layout>
  )
}
