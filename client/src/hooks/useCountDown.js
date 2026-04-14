import { useCallback, useEffect, useState } from "react"

const useCountdownHook = ({ initMinutes = 0, initSeconds = 0 }) => {
  const [minutes, setMinutes] = useState(initMinutes)
  const [seconds, setSeconds] = useState(initSeconds)
  const [isActive, setIsActive] = useState(false)

  const startCountdown = useCallback(() => {
    setIsActive(true)
  }, [])

  const resetCountdown = useCallback((newMinutes, newSeconds) => {
    setMinutes(newMinutes)
    setSeconds(newSeconds)
  }, [])

  useEffect(() => {
    let intervalId
    if (isActive) {
      intervalId = setInterval(() => {
        if (seconds > 0) setSeconds((prev) => prev - 1)
        else if (minutes > 0) {
          setMinutes((prev) => prev - 1)
          setSeconds(59)
        } else clearInterval(intervalId)
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [isActive, minutes, seconds])

  return { seconds, minutes, startCountdown, resetCountdown }
}

export default useCountdownHook
