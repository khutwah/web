import { getStudents } from '../../actions'
import { Students } from './Students'

export async function Filter() {
  const students = await getStudents()

  if ('data' in students) {
    return (
      <Students
        items={students.data.map((student) => ({
          value: String(student.id),
          label: student.name!,
          searchable: student.name!
        }))}
      />
    )
  }

  return null
}
