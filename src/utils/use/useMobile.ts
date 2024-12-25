import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useMobile = () => {
  const isColScreen = ref(false)

  const resize = () => {
    isColScreen.value = window.orientation == 0 || window.orientation == 180
    if (isColScreen.value) MessagePlugin.info('推荐横屏使用')
  }
  window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', resize, false)
  resize()

  return [isColScreen]
}
