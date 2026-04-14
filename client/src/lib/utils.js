import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
export const generateDefaultAvatar = (name, rounded = true) =>
  `https://ui-avatars.com/api/?name=${name}&background=random&color=random&rounded=${rounded}&bold=true&uppercase=false`
export const formatNumberWithZero = (number) => {
  if (!number) return "00"
  if (+number < 10) return `0${number}`
  return number
}
export const shortNumber = (number) => {
  if (!number || isNaN(number)) return 0
  if (number >= Math.pow(10, 9)) {
    const formatNumber = Math.round(number / Math.pow(10, 8))
    return `${Math.round(formatNumber * 10) / 100} tỷ`
  } else if (number >= Math.pow(10, 6)) {
    const formatNumber = Math.round(number / Math.pow(10, 5))
    return `${Math.round(formatNumber * 10) / 100} triệu`
  } else {
    const formatNumber = Math.round(number / Math.pow(10, 2))
    return `${Math.round(formatNumber * 10) / 100} nghìn`
  }
}
export const fromNow = (date) => {
  const now = new Date() // miliseconds
  const specifiedTime = new Date(date) //miliseconds

  const deviation = Math.round((now - specifiedTime) / 1000) // seconds

  if (deviation < 0) return ""

  const days = Math.floor(deviation / (3600 * 24))
  const hours = Math.floor((deviation % (3600 * 24)) / 3600)
  const minutes = Math.floor(((deviation % (3600 * 24)) % 3600) / 60)
  const seconds = Math.floor(((deviation % (3600 * 24)) % 3600) % 60)

  return `${days > 0 ? days + " ngày " : ""}${hours > 0 ? hours + " giờ " : ""}${
    minutes > 0 ? minutes + " phút " : ""
  }${seconds > 0 && deviation < 60 ? seconds + " giây " : "1 giây"} trước`
}
export const handleClassifyMedia = (link) => {
  if (!link) return null
  const videosExt = ["mp4"]

  if (videosExt.some((el) => link.includes(el))) return "VIDEO"
  return "IMAGE"
}
export const convertToPercent = (value, maxValue) => Math.round((value * 100) / maxValue)
export const convertToValue = (percent, maxValue, exp = 1) =>
  Math.round((percent * maxValue) / (100 * exp)) * exp
export const renderGender = (gender) => {
  if (gender === "Nam") return "/Male.svg"
  if (gender === "Nữ") return "/Female.svg"
  if (gender === "Khác") return "/Other.svg"

  return "/AllGender.svg"
}
export const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?background=random&color=random&name=${name}`
export const generateRange = (start, end) => {
  const length = end + 1 - start
  return Array.from({ length }, (_, index) => start + index)
}
export function getDaysInMonth(customTime, number) {
  const endDay = new Date(customTime)?.getDate() || new Date().getDate()
  const days = number || 15
  const endPreviousMonth = new Date(
    new Date(customTime)?.getFullYear(),
    new Date(customTime)?.getMonth(),
    0
  ).getDate()
  let day = 1
  let prevDayStart = 1
  const daysInMonths = []
  while (prevDayStart <= +endPreviousMonth) {
    const month = new Date().getMonth()
    const year = new Date().getFullYear() % 1000
    daysInMonths.push(
      `${prevDayStart < 10 ? "0" + prevDayStart : prevDayStart}-${month < 10 ? `0${month}` : month}-${year}`
    )
    prevDayStart += 1
  }
  while (day <= +endDay) {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear() % 1000
    daysInMonths.push(`${day < 10 ? "0" + day : day}-${month < 10 ? `0${month}` : month}-${year}`)
    day += 1
  }
  return daysInMonths.filter((el, index, self) => index > self.length - days - 2)
}
export function getMonthInYear(customTime, number) {
  const endMonth = new Date(customTime?.to).getMonth() + 1 || new Date().getMonth() + 1
  let month = 1
  const months = number || 8
  let startLastYear = 1
  const daysInMonths = []
  while (startLastYear <= 12) {
    const year = new Date().getFullYear() % 1000
    daysInMonths.push(`${startLastYear < 10 ? `0${startLastYear}` : startLastYear}-${year - 1}`)
    startLastYear += 1
  }
  while (month <= +endMonth) {
    const year = new Date().getFullYear() % 1000
    daysInMonths.push(`${month < 10 ? `0${month}` : month}-${year}`)
    month += 1
  }
  return daysInMonths.filter((el, index, self) => index > self.length - months - 2)
}
export const getDaysInRange = (start, end) => {
  const startDateTime = new Date(start).getTime()
  const endDateTime = new Date(end).getTime()
  return (endDateTime - startDateTime) / (24 * 60 * 60 * 1000)
}
export const getMonthsInRange = (start, end) => {
  let months
  const d1 = new Date(start)
  const d2 = new Date(end)
  months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()
  return months <= 0 ? 0 : months
}
