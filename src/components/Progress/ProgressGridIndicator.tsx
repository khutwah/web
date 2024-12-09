import { Pencil } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import IndicatorDefault from './indicators/default.png'
import IndicatorInactive from './indicators/inactive.png'
import IndicatorLajnahApproaching from './indicators/lajnah-approaching.png'
import IndicatorLajnahReady from './indicators/lajnah-ready.png'
import IndicatorLajnahExam from './indicators/lajnah-exam.png'

interface Props {
  type?:
    | 'default'
    | 'lajnah-approaching'
    | 'lajnah-ready'
    | 'lajnah-exam'
    | 'inactive'
  parameter?: string | undefined
}

export function ProgressGridIndicator({ type, parameter }: Props) {
  const indicator = resolveIndicator(type, parameter)

  return (
    <button
      className='group flex p-3 gap-x-2 bg-mtmh-tamarind-lightest border-t border-mtmh-snow-lighter rounded-b-md'
      aria-label={`Indicator: ${indicator.text}`}
      aria-live='polite'
    >
      <div className='transform transition-transform group-active:rotate-6'>
        <Image
          alt={indicator.image.alt}
          src={indicator.image.src}
          width={32}
          height={32}
        />
      </div>

      <div className='flex flex-1 flex-col gap-y-1 text-mtmh-tamarind-darkest'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='text-mtmh-m-semibold'>{indicator.text}</div>
            <div className='text-mtmh-sm-regular'>{indicator.description}</div>
          </div>
          <Pencil size={16} aria-hidden='true' />
        </div>
      </div>
    </button>
  )
}

interface Indicator {
  image: IndicatorImage
  text: string
  description: string
}

interface IndicatorImage {
  alt: string
  src: StaticImageData
}

function resolveIndicator(
  type: string | undefined,
  parameter: string | undefined
): Indicator {
  switch (type) {
    case 'lajnah-approaching':
      return {
        text: 'Siap-siap lajnah...',
        description: `Alhamdulillah, hafalan anada sudah mendekati ${parameter} juz.`,
        image: {
          alt: 'Jempol arah ke atas',
          src: IndicatorLajnahApproaching
        }
      } as Indicator

    case 'lajnah-ready':
      return {
        text: 'Sedang persiapan lajnah...',
        description: `Bismillah, ananda sedang persiapan untuk lajnah ${parameter} juz.`,
        image: {
          alt: 'Bendera berkibar berwarna merah',
          src: IndicatorLajnahReady
        }
      } as Indicator

    case 'lajnah-exam':
      return {
        text: 'Sedang mengikuti lajnah...',
        description: `Bi'idznillah, ananda sedang mengikuti lajnah ${parameter} juz.`,
        image: {
          alt: 'Api menyala',
          src: IndicatorLajnahExam
        }
      } as Indicator

    case 'inactive':
      return {
        text: 'Sedang berhalangan...',
        description: `Qadarullah, ananda berhalangan karena ${parameter}.`,
        image: {
          alt: 'Hati berwarna merah',
          src: IndicatorInactive
        }
      } as Indicator

    default:
      return {
        text: 'Semangat menghafal...',
        description: 'Alhamdulillah, ananda terus bersemangat menghafal.',
        image: {
          alt: 'Buku catatan',
          src: IndicatorDefault
        }
      } as Indicator
  }
}
