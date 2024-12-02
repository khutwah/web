import { ActivityFormValues } from '@/models/activities'

const submit = async ({
  data,
  url,
  method
}: {
  data: ActivityFormValues
  url: string
  method: 'POST' | 'PUT'
}) => {
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data)
    })

    // validation error, please handle
    if (response.status === 400) {
      const data = await response.json()

      const details = data.error.details as string
      return {
        success: false,
        message: details
      }
    }

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return {
      success: true,
      message: null
    }
  } catch (error: unknown) {
    console.error(error)
    return {
      success: false,
      message: 'Oops, ada kesalahan memproses data, coba lagi nanti.'
    }
  }
}
const create = async (data: ActivityFormValues) => {
  return await submit({
    data,
    url: '/api/v1/activities',
    method: 'POST'
  })
}

const update = async (id: number, data: ActivityFormValues) => {
  return await submit({
    data,
    url: `/api/v1/activities${id}`,
    method: 'PUT'
  })
}

export { create, update }
