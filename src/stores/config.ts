import { type GetConfigRes, getConfig as _getConfig } from '@/api/parse.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref<GetConfigRes>({
    show_announce: false,
    announce: '',
    custom_button: '',
    name: '',
    logo: '/favicon.ico',
    debug: false,
    max_once: 0,
    min_single_filesize: 0,
    max_single_filesize: 0,
    need_password: false,
    have_account: true,
  })
  const getConfig = async () => {
    const res = await _getConfig()
    config.value = res.data
  }
  return { config, getConfig }
})
