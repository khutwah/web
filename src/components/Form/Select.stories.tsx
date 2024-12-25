import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/Form/Select'

export function Default() {
  return (
    <div className='w-[180px]'>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder='Theme' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
          <SelectItem value='system'>System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
