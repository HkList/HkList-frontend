import { http } from '@/utils/http.ts'
import type { BasePagenation, PagenationReq } from '@/api/pagenation.ts'

export type GetHistoryReq = PagenationReq & {
  token: string
  fingerprint: string
}

export interface GetHistoryRes {
  urls: string[]
  ua: string
  file: { id: number; filename: string; size: number }
  created_at: string
}

/** 获取卡密信息 */
export const getHistory = (params: GetHistoryReq) => {
  return http.request<BasePagenation<GetHistoryRes>>('get', '/user/history', { params })
}
