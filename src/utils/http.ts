import Axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer, Method } from 'axios'
import { stringify } from 'qs'
import NProgress from '@/utils/progress'
import { $t } from '@/utils/use/usei18n.ts'
import { MessagePlugin } from 'tdesign-vue-next'
import router from '@/router/index.ts'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  baseURL: '/api/v1',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
}

export interface baseResponse<T> {
  code: number
  message: string
  data: T
}

class Http {
  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      async (config) => {
        // 开启进度条动画
        NProgress.start()
        // 判断接口路径,自动携带 admin_password
        if (config.url) {
          if (config.url.includes('admin') && !config.url.includes('check_password')) {
            const admin_password = localStorage.getItem('admin_password')
            if (config.method === 'get') {
              config.params = { ...config.params, admin_password }
            } else {
              config.data = { ...config.data, admin_password }
            }
          }
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response) => {
        // 关闭进度条动画
        NProgress.done()
        return response.data
      },
      (error) => {
        // 关闭进度条动画
        NProgress.done()

        const message = error?.response?.data?.message

        if (message) {
          if (message === 'Too Many Attempts.') {
            MessagePlugin.error($t('axios.tooManyAttempts'))
          } else if (message === '请检查 管理员 密码是否正确') {
            MessagePlugin.error($t('axios.wrongAdminPassword'))
            localStorage.clear()
            router.push('/login')
          } else {
            MessagePlugin.error(message)
          }
        } else {
          MessagePlugin.error($t('axios.serverError'))
          console.log(error)
        }

        return Promise.reject(error)
      },
    )
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: Method,
    url: string,
    param?: AxiosRequestConfig,
  ): Promise<baseResponse<T>> {
    return Http.axiosInstance.request({
      method,
      url,
      ...param,
    })
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(url: string, params?: AxiosRequestConfig<P>) {
    return this.request<baseResponse<T>>('post', url, params)
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(url: string, params?: AxiosRequestConfig<P>) {
    return this.request<baseResponse<T>>('get', url, params)
  }
}

export const http = new Http()
