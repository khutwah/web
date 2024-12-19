import { getStudents } from '../../actions'
import { Students } from './Students'

export async function Filter() {
  const students = await getStudents()

  if ('data' in students) {
    return (
      <div className='p-4 pt-0 bg-mtmh-red-base'>
        <Students
          items={students.data.map((student) => ({
            value: String(student.id),
            label: student.name!,
            searchable: student.name!
          }))}
        />
      </div>
    )
  }

  return <div>{students.message}</div>
}
