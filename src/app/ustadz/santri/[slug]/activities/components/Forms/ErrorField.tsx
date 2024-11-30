export function ErrorField({ error }: { error?: string }) {
  if (!error) return null
  return <p className='text-mtmh-error-error text-mtmh-caption'>{error}</p>
}
