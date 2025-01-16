import {
  type GetFileListReq,
  type GetFileListRes,
  getFileList as _getFileList,
  type GetLimitReq,
  type GetLimitRes,
  getLimit as _getLimit,
  type File,
  type GetDownLoadLinksRes,
  getDownloadLinks as _getDownloadLinks,
  getVcode,
} from '@/api/user/parse.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'
import { useConfigStore } from '@/stores/user/config'
import { formatBytes } from '@/utils/format.ts'

const configStore = useConfigStore()

export const useFileListStore = defineStore('fileList', () => {
  const GetFileListReq = ref<GetFileListReq>({
    url: '',
    surl: '',
    pwd: '',
    dir: '/',
    parse_password: '',
  })
  const GetFileListRes = ref<GetFileListRes>()

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = GetFileListReq.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const getFileList = async () => {
    selectedRowKeys.value = []
    const res = await _getFileList(GetFileListReq.value)
    GetFileListRes.value = res.data
    if (GetFileListReq.value.dir !== '/') {
      GetFileListRes.value.list.unshift({
        category: -1,
        fs_id: 0,
        is_dir: true,
        local_ctime: 0,
        local_mtime: 0,
        server_ctime: 0,
        server_mtime: 0,
        size: 0,
        md5: '',
        path: getPreviousPath(),
        server_filename: '返回上一层',
        dlink: '',
      })
    }
  }

  const GetLimitReq = ref<GetLimitReq>({
    token: localStorage.getItem('token') ?? 'guest',
  })
  const GetLimitRes = ref<GetLimitRes>({
    count: 0,
    size: 0,
    expires_at: '1970-01-01 08:00:00',
  })
  const GetLimitError = ref('')

  const getLimit = async () => {
    try {
      const res = await _getLimit(GetLimitReq.value)
      GetLimitRes.value = res.data
      GetLimitError.value = ''
      localStorage.setItem('token', GetLimitReq.value.token)
    } catch (error) {
      const message = (error as { response: { data: { message: string } } })?.response?.data?.message
      if (message) GetLimitError.value = message
    }
  }

  const selectedRowKeys = ref<number[]>([])
  const selectedRows = ref<File[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value as number[]
    selectedRows.value = ctx.selectedRowData as File[]
  }

  const vcode = ref({
    hit_captcha: false,
    vcode_str: '',
    vcode_img: '',
    vcode_input: '',
  })

  const pending = ref(false)
  const GetDownLoadLinksRes = ref<GetDownLoadLinksRes>([])
  const getDownloadLinks = async (event?: PointerEvent | number, row?: File) => {
    if (pending.value) {
      MessagePlugin.error('正在解析中,请稍后再试')
      return false
    }

    const { config } = configStore

    if (event && typeof event !== 'number' && row) {
      event.stopPropagation()
      selectedRows.value = [row]
    }

    const filteFolders = selectedRows.value.filter((item) => item && !item.is_dir)
    if (filteFolders.length !== selectedRows.value.length) MessagePlugin.warning('文件夹不会进行解析,已忽略')

    const filteMinSingleFilesize = filteFolders.filter((file) => file.size > config.min_single_filesize)
    if (filteMinSingleFilesize.length !== filteFolders.length) MessagePlugin.warning('文件过小不会被解析')

    const filteMaxSingleFilesize = filteMinSingleFilesize.filter((file) => file.size < config.max_single_filesize)
    if (filteMaxSingleFilesize.length !== filteMinSingleFilesize.length) MessagePlugin.warning('文件过大不会被解析')

    const rows = filteMaxSingleFilesize
    const sum = rows.reduce((prev, cur) => prev + cur.size, 0)

    if (sum > config.max_all_filesize) {
      MessagePlugin.error(`单次最多解析${formatBytes(config.max_all_filesize)}的文件`)
      return
    }

    if (rows.length > config.max_once) {
      MessagePlugin.error(`单次最多解析${config.max_once}个文件`)
      return
    }

    if (rows.length === 0) {
      MessagePlugin.error(`满足要求的文件数量为0`)
      return
    }

    try {
      pending.value = true
      const res = await _getDownloadLinks({
        randsk: GetFileListRes.value!.randsk,
        uk: GetFileListRes.value!.uk,
        shareid: GetFileListRes.value!.shareid,
        fs_id: typeof event === 'number' ? [event] : rows.map((v) => v.fs_id),
        surl: GetFileListReq.value.surl,
        dir: GetFileListReq.value.dir,
        pwd: GetFileListReq.value.pwd,
        token: GetLimitReq.value.token,
        parse_password: GetFileListReq.value.parse_password,
        ...(vcode.value.hit_captcha ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input } : {}),
      })
      if (typeof event === 'number') {
        MessagePlugin.success('重新解析成功')
        return res.data
      } else {
        MessagePlugin.success('解析成功,下滑查看解析结果')
        GetDownLoadLinksRes.value = res.data
      }
      vcode.value.hit_captcha = false
    } catch (_error) {
      const error = _error as { response: { data: { message: string } } }
      if (error?.response?.data?.message?.includes('-20')) {
        // -20 为验证码
        const res = await getVcode({
          parse_password: GetFileListReq.value.parse_password,
        })

        vcode.value = {
          hit_captcha: true,
          ...res.data,
          vcode_input: '',
        }
      } else {
        MessagePlugin.error('解析可能失败或超时了,请稍后前往历史记录中尝试查询是否成功')
      }
    } finally {
      pending.value = false
      await getLimit()
      await configStore.getConfig()
    }
  }

  return {
    GetFileListReq,
    GetFileListRes,
    getFileList,

    GetLimitReq,
    GetLimitRes,
    GetLimitError,
    getLimit,

    selectedRowKeys,
    handleSelectChange,

    getDownloadLinks,
    GetDownLoadLinksRes,

    vcode,
  }
})
