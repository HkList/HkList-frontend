import { useRouter } from 'vue-router'
import { ref } from 'vue'

export const useSelectMenu = (jumpPath: string, defaultValue: string) => {
  const router = useRouter()
  const selectedMenu = ref(defaultValue)
  if (router.currentRoute.value.path.includes(jumpPath)) {
    selectedMenu.value =
      router.currentRoute.value.path.split(jumpPath).pop()?.slice(1) || defaultValue
  }
  const changeMenu = (value: string) => {
    selectedMenu.value = value
    router.push({ path: `/${jumpPath}/${value}` })
  }
  return [selectedMenu, changeMenu]
}
