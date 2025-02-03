export const isMobile = () => {
  const checkUa = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  const checkWidth = document.documentElement.clientWidth <= 500
  return checkUa || checkWidth
}
