import { useEffect, useState } from 'react'

async function getTags() {
  try {
    const response = await fetch('/api/v1/tags')
    const tags = await response.json()

    const groupedByType = (
      tags.data as Array<{ name: string; type: string }>
    ).reduce(
      (acc, item) => {
        // If the type doesn't exist in the accumulator, initialize it as an array
        if (!acc[item.type]) {
          acc[item.type] = []
        }
        // Add the name to the corresponding type
        acc[item.type].push(item.name)
        return acc
      },
      {} as Record<string, string[]>
    )

    return groupedByType
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
