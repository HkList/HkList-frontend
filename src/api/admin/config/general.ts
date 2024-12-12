import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  admin_password: string
  parse_password: string
  show_announce: boolean
  announce: string
  custom_button: string
  debug: boolean
  name: string
  logo: string
}

/** 获取配置文件 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/admin/config/general')
}

export interface UpdateConfigReq {
  new_admin_password: string
  parse_password: string
  show_announce: boolean
  announce: string
  custom_button: string
  debug: boolean
  name: string
  logo: string
}

/** 更新配置文件 */
export const updateConfig = (data: UpdateConfigReq) => {
  return http.request<null>('patch', '/admin/config/general', { data })
}
