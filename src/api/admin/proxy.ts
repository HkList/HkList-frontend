import type { SingleAccount } from '@/api/admin/account.ts'
import type { BasePagenation, PagenationReq } from '@/api/pagenation.ts'
import { http } from '@/utils/http.ts'

export const typeMap: { [key in SelectRes[0]['type']]: string } = {
  http: 'HTTP静态代理',
  api: 'API动态代理',
  proxy: '中转代理',
}

export type SelectReq = PagenationReq & {
  column: 'id' | 'type' | 'proxy' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
  keyword: string
}

export type SelectRes = {
  id: number
  type: 'http' | 'api' | 'proxy'
  proxy: string
  enable: boolean
  reason: string | null
  account: SingleAccount
  account_id: number
  created_at: string
  updated_at: string
}[]

/** 获取 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/proxy', {
    params: data,
  })
}

export type InsertReq = {
  type: 'http' | 'api' | 'proxy'
  proxy: string
  account_id?: number
}

/** 插入 */
export const insert = (data: InsertReq) => {
  return http.request<null>('post', '/admin/proxy', { data })
}

export interface UpdateReq {
  id: number[]
  type?: InsertReq['type']
  proxy?: string
  enable?: boolean
  reason?: string | null
  account_id?: number | null
}

/** 更新 */
export const update = (data: UpdateReq) => {
  return http.request<null>('patch', '/admin/proxy', { data })
}

export interface RemoveReq {
  id: number[]
}

/** 删除 */
export const remove = (data: RemoveReq) => {
  return http.request<null>('delete', '/admin/proxy', { data })
}
