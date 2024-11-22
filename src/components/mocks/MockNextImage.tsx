// This is a mock component for Ladle, because Next features aren't available in it.
export default function MockNextImage({
  width,
  height,
  ...rest
}: {
  width?: number
  height?: number
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      style={{
        width,
        height
      }}
      {...rest}
    />
  )
}
