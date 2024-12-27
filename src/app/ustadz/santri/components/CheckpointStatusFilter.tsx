import { Checkbox } from '@/components/Form/Checkbox'
import { Label } from '@/components/Form/Label'
import { CheckpointStatus, STATUS_LIST } from '@/models/checkpoint'
import { Controller, useFormContext } from 'react-hook-form'

export function CheckpointStatusFilter() {
  const { control } = useFormContext()

  return (
    <div className='space-y-2'>
      <Label>Status Checkpoint</Label>

      <div className='space-y-3'>
        {STATUS_LIST.map((status) => (
          <Controller
            key={status.value}
            control={control}
            name='checkpointStatuses'
            render={({ field }) => {
              const checkboxId = `filter-status-${status.value}`

              return (
                <div className='flex space-x-2' key={status.value}>
                  <Checkbox
                    id={checkboxId}
                    checked={field.value?.includes(status.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = field.value || []
                      const newValues = checked
                        ? [...currentValues, status.value]
                        : currentValues.filter(
                            (value: CheckpointStatus) => value !== status.value
                          )
                      field.onChange(newValues)
                    }}
                  />
                  <label htmlFor={checkboxId} className='text-mtmh-label'>
                    {status.label}
                  </label>
                </div>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}
