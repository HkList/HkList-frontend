export const saveFile = (stringData: string, filename: string = '卡密列表.txt') => {
  const blob = new Blob([stringData], {
    type: 'text/plain;charset=utf-8',
  })

  const objectURL = URL.createObjectURL(blob)

  const aTag = document.createElement('a')
  aTag.href = objectURL
  aTag.download = filename
  aTag.click()
  URL.revokeObjectURL(objectURL)
}
