import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export interface Aria2Config {
  host: string
  port: number
  token: string
}

export const useAria2Store = defineStore('aria2Store', () => {
  const aria2ConfigDialogVisible = ref(false)
  const aria2ConfigForm = ref<Aria2Config>({
    host: 'http://localhost',
    port: 6800,
    token: '',
  })

  onMounted(() => {
    const aria2Config = localStorage.getItem('aria2Config')
    if (aria2Config) aria2ConfigForm.value = JSON.parse(aria2Config)
  })

  const showAria2Config = () => (aria2ConfigDialogVisible.value = true)
  const hideAria2Config = () => (aria2ConfigDialogVisible.value = false)
  const saveAria2Config = () => localStorage.setItem('aria2Config', JSON.stringify(aria2ConfigForm.value))

  return {
    aria2ConfigDialogVisible,
    showAria2Config,
    hideAria2Config,
    aria2ConfigForm,
    saveAria2Config,
  }
})
