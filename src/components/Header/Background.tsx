export function HeaderBackground({ height = 218 }: { height?: number }) {
  return (
    <div
      className='w-full bg-khutwah-red-base absolute -z-10'
      style={{ height }}
    />
  )
}
