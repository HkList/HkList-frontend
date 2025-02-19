import type { SelectRes as AccountSelectRes } from '@/api/admin/account.ts'
import type { SelectRes as TokenSelectRes } from '@/api/admin/token.ts'
import type { BasePagenation, PagenationReq } from '@/api/pagenation.ts'
import { http } from '@/utils/http.ts'

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
  account: AccountSelectRes[number]
  token: TokenSelectRes[number]
  file: {
    id: number
    surl: string
    pwd: string
    fs_id: string
    filename: string
    size: number
    created_at: string
    updated_at: string
  }
}

export type SelectRes = SingleRecord[]

/** 获取 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/record', {
    params: data,
  })
}
