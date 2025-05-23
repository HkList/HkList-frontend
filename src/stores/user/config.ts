import { type GetConfigRes, getConfig as _getConfig } from '@/api/user/parse'
import { useSiteInfo } from '@/utils/use/useSiteInfo.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref<GetConfigRes>({
    show_announce: false,
    announce: '',
    custom_button: '',
    show_hero: false,
    name: '',
    logo: '/favicon.ico',
    debug: false,
    max_once: 0,
    min_single_filesize: 0,
    max_single_filesize: 0,
    max_all_filesize: 0,
    need_password: false,
    have_account: true,
    allow_folder: false,
  })
  const getConfig = async () => {
    // 动态导入，避免循环引用
    const { useFileListStore } = await import('@/stores/user/fileList.ts')
    const fileListStore = useFileListStore()
    const res = await _getConfig({ token: fileListStore.GetLimitReq.token })
    config.value = res.data
    useSiteInfo(res.data.name, res.data.logo)
  }
  return { config, getConfig }
})
