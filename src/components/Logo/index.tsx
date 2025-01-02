import Image from 'next/image'

interface LogoProps {
  variant: 'main' | 'white'
}

const images = {
  main: {
    src: `https://images.khutwah.id/${process.env.NEXT_PUBLIC_APP_NAMESPACE || 'mh'}/logo/main-min.png`,
    width: 227,
    height: 66
  },
  white: {
    src: `https://images.khutwah.id/${process.env.NEXT_PUBLIC_APP_NAMESPACE || 'mh'}/logo/white-min.png`,
    width: 121,
    height: 46
  }
}

export default function Logo({ variant }: LogoProps) {
  const { src, width, height } = images[variant]
  return (
    <Image
      alt={`${process.env.NEXT_PUBLIC_APP_TITLE || 'Minhajul Haq'} Logo`}
      src={src}
      width={width}
      height={height}
      priority
    />
  )
}
