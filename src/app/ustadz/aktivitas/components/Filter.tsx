import { FilterProps } from '@/models/activity-list'
import { getStudents } from '../actions'
import Link from 'next/link'

export async function Filter(props: Readonly<FilterProps>) {
  const { studentId } = props
  const students = await getStudents()

  if ('data' in students) {
    return (
      <div>
        {students.data.map((item) => (
          <Link
            key={item.id}
            href={`?student_id=${item.id}`}
            data-active={studentId === item.id}
          >
            {item.name}
          </Link>
        ))}
      </div>
    )
  }

  return <div>{students.message}</div>
}
