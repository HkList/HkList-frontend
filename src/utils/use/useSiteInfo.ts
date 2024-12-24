export const useSiteInfo = (name: string, logo: string) => {
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon !== null) {
    favicon.setAttribute('href', logo)
  } else {
    const newFavicon = document.createElement('link')
    newFavicon.rel = 'icon'
    newFavicon.href = logo
    document.head.appendChild(newFavicon)
  }
  document.title = name
}
