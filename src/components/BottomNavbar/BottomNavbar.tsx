'use client'
import { BottomNavbarProps } from '@/models/bottom-navbar'
import Link from 'next/link'
import classNames from 'clsx'

function activeStyle(active: boolean) {
  return {
    'text-mtmh-red-light': active,
    'text-mtmh-grey-lighter': !active
  }
}

export function BottomNavbar(props: BottomNavbarProps) {
  const { links } = props

  return (
    <div className='grid grid-flow-col auto-cols-fr w-full shadow-flat-top bg-white'>
      {links.map((link) => {
        const Icon = link.icon

        return (
          <Link
            key={link.href}
            href={link.href}
            className={classNames(
              'flex-1 flex flex-col py-3 gap-1 items-center justify-center border-b-[3px]',
              {
                'border-mtmh-red-light': link.active,
                'border-transparent': !link.active
              }
            )}
          >
            <Icon
              className={classNames(
                'size-6 text-primary',
                activeStyle(link.active)
              )}
            />
            <span
              className={classNames(
                'text-mtmh-xs-regular',
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
