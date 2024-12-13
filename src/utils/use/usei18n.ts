import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'

export const useI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'zh',
    fallbackLocale: 'zh',
    messages: { zh },
  })
}

export const $t = (key: string) => useI18n().global.t(key)
