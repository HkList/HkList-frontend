import { http } from '@/utils/http.ts'

export interface GetConfigReq {
  token: string
}

export interface GetConfigRes {
  show_announce: boolean
  announce: string
  custom_button: string
  show_hero: boolean
  name: string
  logo: string
  debug: boolean
  max_once: number
  min_single_filesize: number
  max_single_filesize: number
  max_all_filesize: number
  need_password: boolean
  have_account: boolean
  allow_folder: boolean
}

/** 获取配置信息 */
export const getConfig = (params: GetConfigReq) => {
  return http.request<GetConfigRes>('get', '/user/parse/config', { params })
}

export interface GetLimitReq {
  token: string
}

export interface GetLimitRes {
  count: number
  size: number
  expires_at: string | null
}

/** 获取当前卡密信息 */
export const getLimit = (params: GetLimitReq) => {
  return http.request<GetLimitRes>('get', '/user/parse/limit', { params })
}

export interface GetFileListReq {
  url: string
  surl: string
  pwd: string
  dir: string
  page?: number
  num?: number
  order?: 'time' | 'filename'
  parse_password: string
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

export interface GetVcodeReq {
  parse_password: string
}

export interface GetVcodeRes {
  vcode_str: string
  vcode_img: string
}

/** 获取验证码 */
export const getVcode = (data: GetVcodeReq) => {
  return http.request<GetVcodeRes>('post', '/user/parse/get_vcode', { data })
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
  parse_password: string
  vcode_str?: string
  vcode_input?: string
}

export type GetDownLoadLinksRes = {
  message: string
  filename: string
  fs_id: number
  ua: string
  urls?: string[]
}[]

/** 获取下载链接 */
export const getDownloadLinks = (data: GetDownloadLinksReq) => {
  return http.request<GetDownLoadLinksRes>('post', '/user/parse/get_download_links', { data })
}
