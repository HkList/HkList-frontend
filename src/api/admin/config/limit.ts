import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  max_once: number
  min_single_filesize: number
  max_single_filesize: number
  max_download_daily_pre_account: number
  limit_cn: boolean
  limit_prov: boolean
  fingerprint_for_ip: number
}

/** 获取配置文件 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/admin/config/limit')
}

export type UpdateConfigReq = GetConfigRes

/** 更新配置文件 */
export const updateConfig = (data: UpdateConfigReq) => {
  return http.request<null>('patch', '/admin/config/limit', { data })
}
