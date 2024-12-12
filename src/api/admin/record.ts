import { http } from '@/utils/http.ts'
import type { BasePagenation, PagenationReq } from '@/api/admin/pagenation.ts'

export type SelectReq = PagenationReq & {
  column:
    | 'id'
    | 'ip'
    | 'fingerprint'
    | 'fs_id'
    | 'url'
    | 'ua'
    | 'token_id'
    | 'account_id'
    | 'created_at'
    | 'updated_at'
  direction: 'asc' | 'desc'
}

export interface SingleRecord {
  id: number
  type: 'fingerprint' | 'ip'
  identifier: string
  reason: string
  expires_at: string
  created_at: string
  updated_at: string
}

export type SelectRes = SingleRecord[]

/** 获取 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/record', {
    params: data,
  })
}
