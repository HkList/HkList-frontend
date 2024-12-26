import { http } from '@/utils/http.ts'
import type { BasePagenation, PagenationReq } from '@/api/pagenation.ts'

export type SelectReq = PagenationReq & {
  column: 'id' | 'fingerprint' | 'ip' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
}

export type SelectRes = {
  id: number
  fingerprint: string
  ip: string[]
  created_at: string
  updated_at: string
}[]

/** 查看密码是否正确 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/fingerprint', { data })
}
