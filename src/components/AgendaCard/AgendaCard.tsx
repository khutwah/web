import { Card, CardContent, CardFooter } from '../Card/Card'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/Badge/Badge'

interface Props {
  id: string
  title: string
  date: string
  category: string
  description: string
}

export default function AgendaCard({
  id,
  title,
  date,
  category,
  description
}: Props) {
  return (
    // FIXME(dio-khutwah): We need to have a proper URL for the following Link.
    <Link href={`?agenda=${id}`}>
      <Card className='max-w-2xl overflow-hidden relative group'>
        <div className='absolute inset-0 transition-transform duration-500 group-active:brightness-75'>
          <Image
            src='https://images.unsplash.com/photo-1641069419212-2ba5f8de1dcd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ix'
            alt='Background image'
            className='object-cover'
            fill
            priority
          />
        </div>
        <div className='relative flex flex-col h-full'>
          <CardContent className='flex-grow p-6 bg-gradient-to-b from-black/70 via-black/50 to-transparent text-white'>
            <div className='flex justify-between items-start'>
              <div className='space-y-3'>
                <div className='flex items-center text-xs'>
                  <Calendar className='mr-1 h-4 w-4' />
                  <p>{date}</p>
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
              </div>
              <Badge color='outline' text={category} />
            </div>
          </CardContent>
          <CardFooter className='bg-mtmh-red-base/70 p-4 text-white'>
            <p className='text-xs'>{description}</p>
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}
