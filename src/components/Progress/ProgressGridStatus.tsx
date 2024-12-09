import { Pencil } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import StatusDefault from './statuses/default.png'
import StatusInactive from './statuses/inactive.png'
import StatusLajnahApproaching from './statuses/lajnah-approaching.png'
import StatusLajnahReady from './statuses/lajnah-ready.png'
import StatusLajnahExam from './statuses/lajnah-exam.png'

export interface ProgressGridStatusProps {
  status?:
    | 'default'
    | 'lajnah-approaching'
    | 'lajnah-ready'
    | 'lajnah-exam'
    | 'inactive'
  parameter?: string | undefined
}

export function ProgressGridStatus({
  status,
  parameter
}: ProgressGridStatusProps) {
  const Status = resolveStatus(status, parameter)

  return (
    <button
      className='group flex p-3 gap-x-2 bg-mtmh-tamarind-lightest border-t border-mtmh-snow-lighter rounded-b-md'
      aria-label={`Status: ${Status.text}`}
      aria-live='polite'
    >
      <div className='transform transition-transform group-active:rotate-6'>
        <Image
          alt={Status.image.alt}
          src={Status.image.src}
          width={32}
          height={32}
        />
      </div>

      <div className='flex flex-1 flex-col gap-y-1 text-mtmh-tamarind-darkest'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='text-mtmh-m-semibold'>{Status.text}</div>
            <div className='text-mtmh-sm-regular'>{Status.description}</div>
          </div>
          <Pencil size={16} aria-hidden='true' />
        </div>
      </div>
    </button>
  )
}

interface Status {
  image: StatusIcon
  text: string
  description: string
}

interface StatusIcon {
  alt: string
  src: StaticImageData
}

function resolveStatus(
  status: string | undefined,
  parameter: string | undefined
): Status {
  switch (status) {
    case 'lajnah-approaching':
      return {
        text: 'Siap-siap lajnah...',
        description: `Alhamdulillah, hafalan anada sudah mendekati ${parameter} juz.`,
        image: {
          alt: 'Jempol arah ke atas',
          src: StatusLajnahApproaching
        }
      } as Status

    case 'lajnah-ready':
      return {
        text: 'Sedang persiapan lajnah...',
        description: `Bismillah, ananda sedang persiapan untuk lajnah ${parameter} juz.`,
        image: {
          alt: 'Bendera berkibar berwarna merah',
          src: StatusLajnahReady
        }
      } as Status

    case 'lajnah-exam':
      return {
        text: 'Sedang mengikuti lajnah...',
        description: `Bi'idznillah, ananda sedang mengikuti lajnah ${parameter} juz.`,
        image: {
          alt: 'Api menyala',
          src: StatusLajnahExam
        }
      } as Status

    case 'inactive':
      return {
        text: 'Sedang berhalangan...',
        description: `Qadarullah, ananda berhalangan karena ${parameter}.`,
        image: {
          alt: 'Hati berwarna merah',
          src: StatusInactive
        }
      } as Status

    default:
      return {
        text: 'Semangat menghafal...',
        description: 'Alhamdulillah, ananda terus bersemangat menghafal.',
        image: {
          alt: 'Buku catatan',
          src: StatusDefault
        }
      } as Status
  }
}
