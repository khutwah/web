import { Checkbox } from '@/components/Form/Checkbox'
import { Label } from '@/components/Form/Label'
import { STATUS_LIST } from '@/models/checkpoint'

export function CheckpointStatusFilter({
  selected
}: {
  selected?: Array<string>
}) {
  return (
    <div className='space-y-2'>
      <Label>Status Checkpoint</Label>
      <div className='space-y-3'>
        {STATUS_LIST.map((status) => (
          <div className='flex space-x-2' key={status.value}>
            <Checkbox
              id={`filter-status-${status.value}`}
              name='checkpointStatuses'
              value={status.value}
              defaultChecked={selected?.includes(status.value)}
            />
            <label
              htmlFor={`filter-status-${status.value}`}
              className='text-mtmh-label'
            >
              {status.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
