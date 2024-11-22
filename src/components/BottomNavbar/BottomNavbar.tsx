import { BottomNavbarProps } from '@/models/bottom-navbar'
import Link from 'next/link'
import classNames from 'classnames'

function activeStyle(active: boolean) {
  return {
    'text-mtmh-primary-primary': active,
    'text-mtmh-neutral-30': !active
  }
}

export function BottomNavbar(props: BottomNavbarProps) {
  const { links } = props

  return (
    <div className='flex w-full border-t border-neutral-10 justify-around'>
      {links.map((link) => {
        const Icon = link.icon

        return (
          <Link
            key={link.href}
            href={link.href}
            className='h-16 flex flex-col p-2 gap-2 items-center'
          >
            <Icon
              className={classNames(
                'size-6 text-primary',
                activeStyle(link.active)
              )}
            />
            <span
              className={classNames(
                'text-mtmh-label',
                activeStyle(link.active)
              )}
            >
              {link.text}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
