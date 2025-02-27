import {
  getDownloadLinks as _getDownloadLinks,
  getFileList as _getFileList,
  getLimit as _getLimit,
  getVcode,
  type File,
  type GetDownLoadLinksRes,
  type GetFileListReq,
  type GetFileListRes,
  type GetLimitReq,
  type GetLimitRes,
} from '@/api/user/parse.ts'
import { useConfigStore } from '@/stores/user/config'
import { formatBytes } from '@/utils/format.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type MessageInstance, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

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

  const paths = ref<string[]>([])

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    if (paths.value.length === 0) return '/'
    return paths.value[paths.value.length - 2] ?? '/'
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
    } else {
      paths.value = []
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
    if (filteFolders.length !== selectedRows.value.length) MessagePlugin.warning('暂时不支持解析文件夹')

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
      vcode.value.hit_captcha = false

      if (typeof event === 'number') {
        const res = await _getDownloadLinks({
          randsk: GetFileListRes.value!.randsk,
          uk: GetFileListRes.value!.uk,
          shareid: GetFileListRes.value!.shareid,
          fs_id: [event],
          surl: GetFileListReq.value.surl,
          dir: GetFileListReq.value.dir,
          pwd: GetFileListReq.value.pwd,
          token: GetLimitReq.value.token,
          parse_password: GetFileListReq.value.parse_password,
          ...(vcode.value.hit_captcha ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input } : {}),
        })
        MessagePlugin.success('重新解析成功')
        return res.data
      } else {
        const res: GetDownLoadLinksRes = []
        let message: MessageInstance | null = null
        let row: File

        try {
          for (const index in rows) {
            row = rows[index]
            if (message) message.close()
            message = await MessagePlugin.loading(`正在解析第${parseFloat(index) + 1}个文件:${row.server_filename}`, 9999999)

            const link = await _getDownloadLinks({
              randsk: GetFileListRes.value!.randsk,
              uk: GetFileListRes.value!.uk,
              shareid: GetFileListRes.value!.shareid,
              fs_id: [row.fs_id],
              surl: GetFileListReq.value.surl,
              dir: GetFileListReq.value.dir,
              pwd: GetFileListReq.value.pwd,
              token: GetLimitReq.value.token,
              parse_password: GetFileListReq.value.parse_password,
              ...(vcode.value.hit_captcha ? { vcode_str: vcode.value.vcode_str, vcode_input: vcode.value.vcode_input } : {}),
            })
            res.push(...link.data)

            // 取消选中
            if (row === null) continue
            selectedRowKeys.value = selectedRowKeys.value.filter((item) => item !== row.fs_id)
            selectedRows.value = selectedRows.value.filter((item) => item.fs_id !== row.fs_id)
          }
        } catch (error) {
          if (message) message.close()
          GetDownLoadLinksRes.value = res
          MessagePlugin.success('部分解析成功,下滑查看解析结果')
          throw error
        }

        if (message) message.close()
        MessagePlugin.success('解析成功,下滑查看解析结果')
        GetDownLoadLinksRes.value = res
      }
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
    paths,
  }
})
