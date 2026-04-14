import { useEffect, useState } from "react"

const useDebounce = (value, ms) => {
  const [debouncedValue, setDebouncedValue] = useState("")
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, ms)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, ms])
  return debouncedValue
}

export default useDebounce
