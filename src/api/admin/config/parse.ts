import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  parser_server: string
  parser_password: string
  parse_mode: number
  user_agent: string
  use_exploit: boolean
  allow_folder: boolean
}

/** 获取配置文件 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/admin/config/parse')
}

export type UpdateConfigReq = GetConfigRes

/** 更新配置文件 */
export const updateConfig = (data: UpdateConfigReq) => {
  return http.request<null>('patch', '/admin/config/parse', { data })
}

export interface TestAuthRes {
  valid: boolean
  expires_at: string
}

/** 测试授权 */
export const testAuth = () => {
  return http.request<TestAuthRes>('post', '/admin/config/parse/test_auth')
}
