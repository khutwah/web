import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/Form/Checkbox'
import { Label } from '@/components/Form/Label'

import { CheckpointStatus, STATUS_LIST } from '@/models/checkpoints'
import { FilterFormData } from '@/app/ustadz/santri/models/filter-form'

interface CheckpointStatusFilterProps {
  excludes?: CheckpointStatus[]
}

export function CheckpointStatusFilter({
  excludes = []
}: CheckpointStatusFilterProps) {
  const { control } = useFormContext<FilterFormData>()

  return (
    <div className='space-y-2'>
      <Label>Status</Label>

      <div className='space-y-3'>
        {STATUS_LIST.filter((status) => !excludes.includes(status.value)).map(
          (status) => (
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
                              (value: CheckpointStatus) =>
                                value !== status.value
                            )
                        field.onChange(newValues)
                      }}
                    />
                    <label
                      htmlFor={checkboxId}
                      className='text-khutwah-label cursor-pointer'
                    >
                      {status.label}
                    </label>
                  </div>
                )
              }}
            />
          )
        )}
      </div>
    </div>
  )
}
