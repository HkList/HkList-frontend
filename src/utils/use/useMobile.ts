import { ref } from 'vue'

export const useMobile = () => {
  const isColScreen = ref(false)

  const resize = () => (isColScreen.value = window.orientation == 0 || window.orientation == 180)
  window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', resize, false)
  resize()

  return [isColScreen]
}
