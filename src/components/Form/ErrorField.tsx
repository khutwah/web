export function ErrorField({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p className='text-khutwah-error-error text-khutwah-caption'>{error}</p>
  )
}
