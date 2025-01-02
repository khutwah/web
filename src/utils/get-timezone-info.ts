import { cookies } from 'next/headers'

export default async function getTimezoneInfo() {
  const cookieStore = await cookies()
  return cookieStore.get('timezone')?.value || 'Asia/Jakarta' // Fallback to sensible default.
}
