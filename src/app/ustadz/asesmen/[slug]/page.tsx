import { StateMessage } from '@/components/StateMessage/StateMessage'
import { Assessments } from '@/utils/supabase/models/assessments'

interface AsesmenPageProps {
  params: Promise<{ slug: number }>
}

export default async function AsesemenPage({
  params: paramsPromise
}: Readonly<AsesmenPageProps>) {
  const { slug } = await paramsPromise

  const assessmentsInstance = new Assessments()
  const assessments = await assessmentsInstance.list({
    parent_assessment_id: slug
  })

  if (assessments.error) {
    return (
      <StateMessage
        type='error'
        title='Maaf, Ada Kesalahan di Sistem'
        description='Terjadi kesalahan. Kami sedang memperbaiki. Mohon coba lagi nanti.'
      />
    )
  }

  console.log(assessments)

  return <div>{slug}</div>
}
