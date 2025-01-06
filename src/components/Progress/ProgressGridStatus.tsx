import { Pencil } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import StatusDefault from './statuses/default.png'
import StatusInactive from './statuses/inactive.png'
import StatusAssessmentApproaching from './statuses/lajnah-assessment-approaching.png'
import StatusAssessmentReady from './statuses/lajnah-assessment-ready.png'
import StatusAssessmentOngoing from './statuses/lajnah-assessment-ongoing.png'
import { CheckpointStatus } from '@/models/checkpoints'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../Drawer/Drawer'
import { useState } from 'react'
import { CheckpointDrawer } from './CheckpointDrawer'

export interface ProgressGridStatusProps {
  editable?: boolean
  status?: CheckpointStatus
  parameter?: string | undefined
  checkpointId?: number
  lastActivityId?: number | null
  pageCountAccumulation?: number | null
  studentId?: number | null
  partCount?: number | null
  notes?: string | null
}

export function ProgressGridStatus({
  editable = false,
  status,
  parameter,
  checkpointId,
  lastActivityId,
  pageCountAccumulation,
  studentId,
  partCount,
  notes
}: ProgressGridStatusProps) {
  const resolvedStatus = resolveStatus(status, parameter)
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className='group flex p-3 gap-x-2 bg-khutwah-tamarind-lightest border-t border-khutwah-snow-lighter rounded-b-md'
          aria-label={`Status: ${resolvedStatus.text}`}
          aria-live='polite'
          disabled={!editable}
        >
          <div className='transform transition-transform group-active:rotate-6'>
            <Image
              alt={resolvedStatus.image.alt}
              src={resolvedStatus.image.src}
              width={32}
              height={32}
            />
          </div>

          <div className='flex flex-1 flex-col gap-y-1 text-khutwah-tamarind-darkest'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-khutwah-m-semibold'>
                  {resolvedStatus.text}
                </div>
                <div className='text-khutwah-sm-regular'>
                  {resolvedStatus.description}
                </div>
              </div>
              {editable && <Pencil size={16} aria-hidden='true' />}
            </div>
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-left'>Update Status</DrawerTitle>
          <DrawerDescription className='hidden'>
            Pilih status Ananda
          </DrawerDescription>
        </DrawerHeader>

        <CheckpointDrawer
          id={checkpointId}
          status={status}
          lastActivityId={lastActivityId}
          pageCountAccumulation={pageCountAccumulation}
          studentId={studentId}
          onFinish={() => setOpen(false)}
          notes={notes}
          partCount={partCount}
        />
      </DrawerContent>
    </Drawer>
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
  status: CheckpointStatus | undefined,
  parameter: string | undefined
): Status {
  switch (status) {
    case 'lajnah-assessment-approaching':
      return {
        text: `Siap-siap Asesmen Lajnah ${parameter} juz...`,
        description: `Alhamdulillah, hafalan ananda sudah mendekati ${parameter} juz.`,
        image: {
          alt: 'Jempol arah ke atas',
          src: StatusAssessmentApproaching
        }
      }

    case 'lajnah-assessment-ready':
      return {
        text: `Sedang persiapan Asesmen Lajnah ${parameter} juz...`,
        description: `Bismillah. Ananda telah dinyatakan siap Asesmen Lajnah ${parameter} juz.`,
        image: {
          alt: 'Bendera berkibar berwarna merah',
          src: StatusAssessmentReady
        }
      }

    case 'lajnah-assessment-ongoing':
      return {
        text: `Sedang mengikuti Asesmen Lajnah ${parameter} juz...`,
        description: `Bi'idznillah, ananda sedang mengikuti Asesmen Lajnah ${parameter} juz.`,
        image: {
          alt: 'Api menyala',
          src: StatusAssessmentOngoing
        }
      }

    case 'assessment-ongoing':
      return {
        text: 'Sedang mengikuti Asesmen...',
        description: `Bi'idznillah, ananda sedang mengikuti Asesmen.`,
        image: {
          alt: 'Api menyala',
          src: StatusAssessmentOngoing
        }
      }

    case 'inactive':
      return {
        text: 'Sedang berhalangan...',
        description: `Qadarullah, ananda berhalangan karena ${parameter}.`,
        image: {
          alt: 'Hati berwarna merah',
          src: StatusInactive
        }
      }

    default:
      return {
        text: 'Semangat menghafal...',
        description: 'Alhamdulillah, ananda terus bersemangat menghafal.',
        image: {
          alt: 'Buku catatan',
          src: StatusDefault
        }
      }
  }
}
