import { http } from '@/utils/http.ts'

export interface InstallReq {
  app_name: string
  db_host: string
  db_port: number
  db_username: string
  db_password?: string
}

/** 安装程序 */
export const install = (data: InstallReq) => {
  return http.request<null>('post', '/install', { data })
}
