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
const create = (data: ActivityFormValues) => {
  return submit({
    data,
    url:
      '/api/v1/activities' +
      `?alwaysCreate=${data.alwaysCreate ? 'true' : 'false'}`,
    method: 'POST'
  })
}

const update = (id: number, data: ActivityFormValues) => {
  return submit({
    data,
    url: `/api/v1/activities/${id}`,
    method: 'PUT'
  })
}

export { create, update }
