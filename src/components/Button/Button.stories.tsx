import { Button } from './Button'

export function Variant() {
  return (
    <div className='flex gap-2'>
      <Button>Primary (default)</Button>
      <Button disabled>Primary Disabled </Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='outline' disabled>
        Outline Disabled
      </Button>
    </div>
  )
}
export function Sizes() {
  return (
    <div className='flex gap-2'>
      <Button size='lg'>Large</Button>
      <Button>Medium (default)</Button>
      <Button size='sm'>Small</Button>
    </div>
  )
}
