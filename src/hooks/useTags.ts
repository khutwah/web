import { useEffect, useState } from 'react'

async function getTags() {
  try {
    const response = await fetch('/api/v1/tags')
    const tags = await response.json()

    const groupedByCategory = (
      tags.data as Array<{ name: string; category: string }>
    ).reduce(
      (acc, item) => {
        // If the type doesn't exist in the accumulator, initialize it as an array
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        // Add the name to the corresponding type
        acc[item.category].push(item.name)
        return acc
      },
      {} as Record<string, string[]>
    )

    return groupedByCategory
  } catch (_error) {
    console.error(_error)
    return {}
  }
}

export function useTags() {
  const [tags, setTags] = useState<Record<string, string[]>>({})

  useEffect(() => {
    getTags().then((result) => setTags(result))
  }, [])
  return tags
}
