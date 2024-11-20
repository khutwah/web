// This is a mock component for Ladle, because Next features aren't available in it.
export default function MockNextImage({
  src,
  alt,
  width,
  height
}: {
  src: string
  alt: string
  width?: number
  height?: number
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height
      }}
    />
  )
}
