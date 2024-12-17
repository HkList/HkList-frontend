import { http } from '@/utils/http.ts'
import type { BasePagenation, PagenationReq } from '@/api/admin/pagenation.ts'

export type SelectReq = PagenationReq & {
  column: 'id' | 'ip' | 'fingerprint' | 'fs_id' | 'urls' | 'ua' | 'token_id' | 'account_id' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
}

export interface SingleRecord {
  id: number
  ip: string
  fingerprint: string
  fs_id: number
  urls: string[]
  ua: string
  token_id: number
  account_id: number
  created_at: number
  updated_at: number
}

export type SelectRes = SingleRecord[]

/** 获取 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/record', {
    params: data,
  })
}
