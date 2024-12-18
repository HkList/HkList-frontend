import dayjs from 'dayjs'

export const GB = 1073741824

export const formatBytes = (bytes: number | string, decimals = 2) => {
  if (typeof bytes === 'string') bytes = parseFloat(bytes)
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

export const formatDateToString = (timeString: dayjs.ConfigType, format = 'YYYY/MM/DD HH:mm:ss') => dayjs(timeString).format(format)

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return formatDateToString(date)
}
