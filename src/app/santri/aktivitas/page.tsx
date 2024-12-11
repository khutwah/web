import dayjs from '@/utils/dayjs'
import { Info } from 'lucide-react'

import { Card, CardContent } from '@/components/Card/Card'
import { HeaderBackground } from '@/components/Header/Background'
import { Layout } from '@/components/Layouts/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressGridWithState } from '@/components/Progress/ProgressGrid'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/Tabs/Tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/Alert/Alert'
import { ActivityCard } from '@/components/ActivityCard/ActivityCard'

import { ActivityStatus } from '@/models/activities'
import { Activities } from '@/utils/supabase/models/activities'
import { getUser } from '@/utils/supabase/get-user'
export default async function Aktivitas() {
  const parentUser = await getUser()

  const activitiesInstance = new Activities()
  const activities = await activitiesInstance.list({
    parent_id: parentUser.data?.id,
    start_date: dayjs().startOf('week').toISOString(),
    end_date: dayjs().endOf('week').toISOString()
  })

  return (
    <Layout>
      <HeaderBackground />

      <Navbar text='Aktivitas' />

      <div className='px-6 space-y-8'>
        <section className='flex flex-col gap-y-4'>
          <div className='flex justify-center gap-x-[6.5px] text-mtmh-neutral-white text-mtmh-m-regular'>
            <SantriActivityHeader />
          </div>

          <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
            <CardContent className='flex flex-col p-0 gap-y-3'>
              <ProgressGridWithState
                activities={activities.data}
                className='border-none rounded-none'
                editable={false}
              />
            </CardContent>
          </Card>
        </section>

        <section className='space-y-3'>
          <h2 className='text-mtmh-m-semibold'>Aktivitas Terakhir</h2>
          <Tabs defaultValue='sabaq' className='w-full space-y-3'>
            <TabsList className='flex w-full'>
              <TabsTrigger
                value='sabaq'
                className='flex-grow flex-shrink min-w-0 w-full'
              >
                Sabaq
              </TabsTrigger>
              <TabsTrigger
                value='sabqi'
                className='flex-grow flex-shrink min-w-0 w-full'
              >
                Sabqi
              </TabsTrigger>
              <TabsTrigger
                value='manzil'
                className='flex-grow flex-shrink min-w-0 w-full'
              >
                Manzil
              </TabsTrigger>
            </TabsList>
            <TabsContent value='sabaq' className='space-y-3'>
              <Alert className='items-start' variant='info'>
                <Info className='flex-shrink-0' width='16' height='16' />
                <div>
                  <AlertTitle>Apa itu sabaq?</AlertTitle>
                  <AlertDescription>
                    Sabaq adalah proses menambahkan hafalan baru yang harus
                    disetorkan setiap hari oleh siswa Tahfizhul Qur’an
                  </AlertDescription>
                </div>
              </Alert>

              <ul className='space-y-3'>
                <li>
                  <ActivityCard
                    id='1'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '26' }}
                    timestamp={new Date().toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Sabaq'
                    labels={['Terbata-bata', 'Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='2'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '1' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Sabaq'
                    labels={['Terbata-bata']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='3'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'Al-Baqarah', verse: '1' }}
                    surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes=''
                    type='Sabaq'
                    labels={['Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
              </ul>
            </TabsContent>
            <TabsContent value='sabqi' className='space-y-3'>
              <Alert className='items-start' variant='info'>
                <Info className='flex-shrink-0' width='16' height='16' />
                <div>
                  <AlertTitle>Apa itu sabqi?</AlertTitle>
                  <AlertDescription>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore, aut dolor hic sapiente doloremque libero, aperiam
                    rem delectus dignissimos quo quod unde adipisci consectetur,
                    ipsum perferendis incidunt eveniet voluptatibus asperiores.
                  </AlertDescription>
                </div>
              </Alert>

              <ul className='space-y-3'>
                <li>
                  <ActivityCard
                    id='1'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '26' }}
                    timestamp={new Date().toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Sabqi'
                    labels={['Terbata-bata', 'Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='2'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '1' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Sabqi'
                    labels={['Terbata-bata']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='3'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'Al-Baqarah', verse: '1' }}
                    surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes=''
                    type='Sabqi'
                    labels={['Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
              </ul>
            </TabsContent>
            <TabsContent value='manzil' className='space-y-3'>
              <Alert className='items-start' variant='info'>
                <Info className='flex-shrink-0' width='16' height='16' />
                <div>
                  <AlertTitle>Apa itu manzil?</AlertTitle>
                  <AlertDescription>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore, aut dolor hic sapiente doloremque libero, aperiam
                    rem delectus dignissimos quo quod unde adipisci consectetur,
                    ipsum perferendis incidunt eveniet voluptatibus asperiores.
                  </AlertDescription>
                </div>
              </Alert>

              <ul className='space-y-3'>
                <li>
                  <ActivityCard
                    id='1'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '26' }}
                    timestamp={new Date().toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Manzil'
                    labels={['Terbata-bata', 'Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='2'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'At-Taubah', verse: '1' }}
                    surahEnd={{ name: 'At-Taubah', verse: '1' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes='Santri kesulitan menghafal ayat yang memiliki beberapa titik stop dan kemiripan di antara titik-titik tersebut.'
                    type='Manzil'
                    labels={['Terbata-bata']}
                    status={ActivityStatus.completed}
                  />
                </li>
                <li>
                  <ActivityCard
                    id='3'
                    isStudentPresent
                    studentName='Andrizal Herdiwanto Sukmini'
                    halaqahName='Halaqah A1.1'
                    surahStart={{ name: 'Al-Baqarah', verse: '1' }}
                    surahEnd={{ name: 'Al-Baqarah', verse: '286' }}
                    timestamp={new Date(2024, 1, 1, 7).toISOString()}
                    notes=''
                    type='Manzil'
                    labels={['Makhrajul salah: ra']}
                    status={ActivityStatus.completed}
                  />
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  )
}
