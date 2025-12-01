import dayjs from 'dayjs'

export const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // reset phút, giây, mili giây không cần thiết
  const diffTime = end.getTime() - start.getTime() // milliseconds

  const totalHours = Math.floor(diffTime / (1000 * 60 * 60)) // tổng số giờ
  const days = Math.floor(totalHours / 24) // số ngày
  const hours = totalHours % 24 // phần giờ còn lại

  return { days, hours }
}

export const convertToISO = (dateStr: string) => {
  return dayjs(dateStr).startOf('day').format()
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Convert ISO date string to YYYY-MM-DD format for input type="date"
export const convertToDateInput = (dateString: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).format('YYYY-MM-DD')
}
