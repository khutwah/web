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
