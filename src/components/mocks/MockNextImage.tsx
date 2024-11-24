// This is a mock component for Ladle, because Next features aren't available in it.
export default function MockNextImage({
  width,
  height,
  alt,
  ...rest
}: {
  alt?: string
  width?: number
  height?: number
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      style={{
        width,
        height
      }}
      {...rest}
    />
  )
}
