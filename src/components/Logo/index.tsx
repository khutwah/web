import Image from 'next/image'

interface LogoProps {
  variant: 'main' | 'white'
}

const images = {
  main: {
    src: 'https://images.khutwah.id/minhajulhaq/logo/main-min.png',
    width: 227,
    height: 66
  },
  white: {
    src: 'https://images.khutwah.id/minhajulhaq/logo/white-min.png',
    width: 121,
    height: 46
  }
}

export default function Logo({ variant }: LogoProps) {
  const { src, width, height } = images[variant]
  return (
    <Image
      alt='Minhajul Haq'
      src={src}
      width={width}
      height={height}
      priority
    />
  )
}
