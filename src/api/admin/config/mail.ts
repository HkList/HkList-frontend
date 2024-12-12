import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  mail_switch: boolean
  mail_host: string
  mail_port: number
  mail_username: string
  mail_password: string
  mail_from_address: string
  mail_from_name: string
  mail_to_address: string
  mail_to_name: string
}

/** 获取配置文件 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/admin/config/mail')
}

export type UpdateConfigReq = GetConfigRes

/** 更新配置文件 */
export const updateConfig = (data: UpdateConfigReq) => {
  return http.request<null>('patch', '/admin/config/mail', { data })
}

/** 发送测试邮件 */
export const sendTestMail = () => {
  return http.request<null>('post', '/admin/config/mail/send_test_mail')
}
