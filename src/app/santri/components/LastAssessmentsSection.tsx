import { AssessmentCard } from '@/components/AssessmentCard/AssessmentCard'
import { MENU_SANTRI_PATH_RECORDS } from '@/utils/menus/santri'
import { Assessments } from '@/utils/supabase/models/assessments'

interface LastAssessmentsProps {
  studentId: string
  searchParams: { [key: string]: string | string[] | undefined }
  tz: string
}

export default async function LastAssessments({
  studentId,
  searchParams,
  tz
}: LastAssessmentsProps) {
  const asessementsInstance = new Assessments()
  const lastAssessments = await asessementsInstance.list(
    {
      student_id: Number(studentId),
      parent_assessment_id: null,
      limit: 10
    },
    /*isFinalized=*/ true
  )

  return (
    <>
      {lastAssessments.data && lastAssessments.data?.length > 0 && (
        <section className='flex flex-col gap-3 mb-8'>
          <div className='flex flex-row items-center justify-between px-6'>
            <h2 className='text-khutwah-m-semibold'>Ikhtibar Terakhir</h2>
          </div>
          <ul className='flex overflow-x-scroll gap-3 px-6 items-start'>
            {lastAssessments?.data?.map((item) => {
              return (
                <li key={item.id} className='w-[300px] flex-shrink-0 h-full'>
                  <AssessmentCard
                    studentId={studentId}
                    id={String(item.id)}
                    searchParams={searchParams}
                    timestamp={item.end_date!}
                    tz={tz}
                    name={item.session_name}
                    finalMark={item.final_mark}
                    notes={item.notes}
                    pathname={`${MENU_SANTRI_PATH_RECORDS.home}/aktivitas/asesmen/${item.id}`}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
