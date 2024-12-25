import { StateMessage } from '@/components/StateMessage/StateMessage'
import { Lajnah } from '@/utils/supabase/models/lajnah'

interface LajnahPageProps {
  params: Promise<{ slug: number }>
}

export default async function LajnahPage({
  params: paramsPromise
}: Readonly<LajnahPageProps>) {
  const { slug } = await paramsPromise

  const lajnahInstance = new Lajnah()
  const lajnah = await lajnahInstance.list({
    parent_lajnah_id: slug
  })

  if (lajnah.error) {
    return (
      <StateMessage
        type='error'
        title='Maaf, Ada Kesalahan di Sistem'
        description='Terjadi kesalahan. Kami sedang memperbaiki. Mohon coba lagi nanti.'
      />
    )
  }

  console.log(lajnah)

  return <div>{slug}</div>
}
