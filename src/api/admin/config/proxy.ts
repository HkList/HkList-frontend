import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  enable: boolean
  http: string
  https: string
}

/** 获取配置文件 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/admin/config/proxy')
}

export type UpdateConfigReq = GetConfigRes

/** 更新配置文件 */
export const updateConfig = (data: UpdateConfigReq) => {
  return http.request<null>('patch', '/admin/config/proxy', { data })
}

export interface TestProxyRes {
  code: number
  message: string
  success: boolean
  time: string
  data: {
    actionAddress: string[]
    ip: string
    isp: string
    netWorkType: string
    proxy: boolean
    tor: boolean
    vpn: boolean
    spider: boolean
  }
}

/** 测试授权 */
export const testProxy = () => {
  return http.request<TestProxyRes>('post', '/admin/config/proxy/test_proxy')
}
