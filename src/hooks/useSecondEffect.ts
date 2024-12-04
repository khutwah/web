import { useEffect, useRef } from 'react'

export function useSecondEffect(...args: Parameters<typeof useEffect>) {
  const isReady = useRef(false)
  useEffect(() => {
    if (!isReady.current) {
      isReady.current = true
      return
    }
    return args[0]()
  }, args[1])
}
