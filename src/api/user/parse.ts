import { http } from '@/utils/http.ts'

export interface GetConfigRes {
  show_announce: boolean
  announce: string
  custom_button: string
  name: string
  logo: string
  debug: boolean
  max_once: number
  min_single_filesize: number
  max_single_filesize: number
  need_password: boolean
  have_account: boolean
}

/** 获取配置信息 */
export const getConfig = () => {
  return http.request<GetConfigRes>('get', '/user/parse/config')
}

export interface GetLimitReq {
  token: string
}

export interface GetLimitRes {
  count: number
  size: number
  expires_at: string
}

/** 获取当前卡密信息 */
export const getLimit = (params: GetLimitReq) => {
  return http.request<GetLimitRes>('get', '/user/parse/limit', { params })
}

export interface GetFileListReq {
  surl: string
  pwd: string
  dir: string
  page: number
  num: number
  order: 'time' | 'filename'
}

export interface File {
  category: number
  fs_id: number
  is_dir: boolean
  local_ctime: number
  local_mtime: number
  md5: string
  path: string
  server_ctime: number
  server_mtime: number
  server_filename: string
  size: number
  dlink: string
}

export interface GetFileListRes {
  uk: number
  shareid: number
  randsk: string
  list: File[]
}

/** 获取分享链接文件列表 */
export const getFileList = (data: GetFileListReq) => {
  return http.request<GetFileListRes>('post', '/user/parse/get_file_list', {
    data,
  })
}

export interface GetVcodeRes {
  vcode_str: string
  vcode_img: string
}

/** 获取验证码 */
export const getVcode = () => {
  return http.request<GetVcodeRes>('post', '/user/parse/get_vcode')
}

export interface GetDownloadLinksReq {
  randsk: string
  uk: number
  shareid: number
  fs_id: number[]
  surl: string
  dir: string
  pwd: string
  token: string
}

export type GetDownLoadLinksRes = {
  message: '请求成功'
  filename: string
  fs_id: number
  ua: string
  urls?: string[]
}[]

/** 获取下载链接 */
export const getDownloadLinks = (data: GetDownloadLinksReq) => {
  return http.request<GetDownLoadLinksRes>('post', '/user/parse/get_download_links', { data })
}
