import type { BasePagenation, PagenationReq } from '@/api/pagenation.ts'
import { http, type BaseResponse } from '@/utils/http.ts'

export type SelectReq = PagenationReq & {
  column: 'id' | 'baidu_name' | 'uk' | 'account_type' | 'account_data' | 'switch' | 'reason' | 'prov' | 'created_at' | 'updated_at' | 'deleted_at'
  direction: 'asc' | 'desc'
}

export type SingleAccount = {
  id: number
  baidu_name: string
  uk: string
  switch: boolean
  reason: string
  today_count: number
  total_count: number
  today_size: number | null
  total_size: number | null
  prov:
    | null
    | '北京市'
    | '天津市'
    | '上海市'
    | '重庆市'
    | '河北省'
    | '山西省'
    | '内蒙古自治区'
    | '辽宁省'
    | '吉林省'
    | '黑龙江省'
    | '江苏省'
    | '浙江省'
    | '安徽省'
    | '福建省'
    | '江西省'
    | '山东省'
    | '河南省'
    | '湖北省'
    | '湖南省'
    | '广东省'
    | '广西壮族自治区'
    | '海南省'
    | '四川省'
    | '贵州省'
    | '云南省'
    | '西藏自治区'
    | '陕西省'
    | '甘肃省'
    | '青海省'
    | '宁夏回族自治区'
    | '新疆维吾尔自治区'
    | '香港特别行政区'
    | '澳门特别行政区'
    | '台湾省'
  created_at: string
  updated_at: string
  deleted_at: string | null
} & (
  | {
      account_type: 'cookie'
      account_data: {
        cookie: string
        vip_type: '普通用户' | '普通会员' | '超级会员'
        expires_at: string
      }
    }
  | {
      account_type: 'enterprise_cookie'
      account_data: {
        cookie: string
        cid: number
        expires_at: string
      }
    }
  | {
      account_type: 'open_platform'
      account_data: {
        access_token: string
        refresh_token: string
        token_expires_at: string
        vip_type: '普通用户' | '普通会员' | '超级会员'
        expires_at: string
      }
    }
  | {
      account_type: 'download_ticket'
      account_data: {
        surl: string
        pwd: string
        dir: string
        save_cookie: string
        save_bdstoken: string
        download_cookie: string
        download_bdstoken: string
        cid: number
      }
    }
)

export type SelectRes = SingleAccount[]

/** 获取 */
export const select = (data: SelectReq) => {
  return http.request<BasePagenation<SelectRes>>('get', '/admin/account', {
    params: data,
  })
}

export type InsertReq =
  | {
      account_type: 'cookie'
      account_data: {
        cookie: string
      }[]
    }
  | {
      account_type: 'enterprise_cookie'
      account_data: {
        dlink_cookie: string
        cookie: string
        cid: number
      }[]
    }
  | {
      account_type: 'open_platform'
      account_data: {
        refresh_token: string
      }[]
    }
  | {
      account_type: 'download_ticket'
      account_data: {
        surl: string
        pwd: string
        dir: string
        save_cookie: string
        cid: number
        download_cookie: string
      }[]
    }

export interface InsertRes {
  have_repeat: boolean
}

/** 插入 */
export const insert = (data: InsertReq) => {
  return http.request<InsertRes>('post', '/admin/account', { data })
}

export interface UpdateReq {
  switch?: boolean
  prov?: SingleAccount['prov']
  id: number[]
}

/** 更新 */
export const update = (data: UpdateReq) => {
  return http.request<null>('patch', '/admin/account', { data })
}

export interface UpdateInfoReq {
  id: number[]
}

/** 更新账号信息 */
export const updateInfo = (data: UpdateInfoReq) => {
  return http.request<null>('post', '/admin/account/update_info', { data })
}

export interface UpdateData {
  id: number[]
  account_type: SingleAccount['account_type']
  account_data: SingleAccount['account_data']
}

/** 更新账号信息 */
export const updateData = (data: UpdateData) => {
  return http.request<null>('post', '/admin/account/update_data', {
    data,
  })
}

export interface RemoveReq {
  id: number[]
}

/** 删除 */
export const remove = (data: RemoveReq) => {
  return http.request<null>('delete', '/admin/account', { data })
}

export interface CheckBanStatusReq {
  id: number[]
}

export type CheckBanStatusRes = {
  account_type: InsertReq['account_type']
  id: number
  status: BaseResponse<{
    ban_msg: string
    ban_reason: string
    ban_status: boolean
    ban_times: number
    end_time: number
    start_time: number
    user_operate_type: number
  }>[]
}[]

/** 检查账号封禁状态 */
export const checkBanStatus = (data: CheckBanStatusReq) => {
  return http.request<CheckBanStatusRes>('post', '/admin/account/check_ban_status', {
    data,
  })
}

export interface GetAccountCidReq {
  cookie: string
}

export interface EnterpriseAccountInfo {
  cid: number
  org_name: string
  product_endtime: number
  product_starttime: number
  product_name: string
}

export type GetAccountCidRes = EnterpriseAccountInfo[]

/** 获取企业账号信息 */
export const getAccountCidInfo = (data: GetAccountCidReq) => {
  return http.request<GetAccountCidRes>('post', '/admin/account/get_cid_info', {
    data,
  })
}
