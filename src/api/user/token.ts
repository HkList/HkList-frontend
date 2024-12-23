import { http } from '@/utils/http.ts'

export interface GetTokenReq {
  token: string
}

export interface GetTokenRes {
  token: string
  count: number
  size: number
  remaining_count: number
  remaining_size: number
  ip: string[]
  expires_at: string | null
}

/** 获取卡密信息 */
export const getToken = (params: GetTokenReq) => {
  return http.request<GetTokenRes>('get', '/user/token', { params })
}
