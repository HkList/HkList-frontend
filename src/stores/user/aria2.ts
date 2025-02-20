import { defineStore } from 'pinia'
import { MessagePlugin } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import { useFileListStore } from './fileList.ts'

export interface Aria2Config {
  host: string
  token: string
  dir: string
}

export type DownloadRows = {
  filename: string
  fs_id?: number
  ua: string
  urls: string[]
}[]

const fileListStore = useFileListStore()

export const useAria2Store = defineStore('aria2', () => {
  const aria2ConfigDialogVisible = ref(false)
  const aria2ConfigForm = ref<Aria2Config>({
    host: 'ws://localhost:16800/jsonrpc',
    token: '',
    dir: '',
  })

  onMounted(() => {
    const aria2Config = localStorage.getItem('aria2Config')
    if (aria2Config) aria2ConfigForm.value = JSON.parse(aria2Config)
  })

  const showAria2Config = () => (aria2ConfigDialogVisible.value = true)
  const hideAria2Config = () => (aria2ConfigDialogVisible.value = false)
  const saveAria2Config = () => {
    localStorage.setItem('aria2Config', JSON.stringify(aria2ConfigForm.value))
    wsConnection = null
  }

  let wsConnection: WebSocket | null = null
  const connectAria2 = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (wsConnection) {
        wsConnection.close()
        wsConnection = null
      }

      try {
        wsConnection = new WebSocket(aria2ConfigForm.value.host)
        wsConnection.onopen = () => resolve(wsConnection as WebSocket)
        wsConnection.onerror = (error) => {
          MessagePlugin.error('链接到Aria2下载器出错')
          reject(error)
        }
      } catch (error) {
        MessagePlugin.error('链接到Aria2下载器出错')
        reject(error)
      }
    })
  }

  const requestAria2 = async <T>(method: string, params: (string | object)[] = []): Promise<T> => {
    if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
      wsConnection = await connectAria2()
    }

    return new Promise((resolve, reject) => {
      wsConnection = wsConnection as WebSocket

      const requestId = 'HkList' + Date.now().toString()
      const request = {
        jsonrpc: '2.0',
        method,
        id: requestId,
        params: [`token:${aria2ConfigForm.value.token}`, ...params],
      }

      wsConnection.onmessage = (event) => {
        const response = JSON.parse(event.data)
        if (response.id === requestId) {
          if (response.error) {
            reject(response.error)
          } else {
            resolve(response.result)
          }
        }
      }

      wsConnection.send(JSON.stringify(request))
    })
  }

  const getAria2Version = async () => {
    await requestAria2<{ verion: string; enabledFeatures: string[] }>('aria2.getVersion')
    MessagePlugin.success('测试连接成功')
  }

  const addAria2Url = async (url: string, filename: string, ua: string, threadCount: number) => {
    await requestAria2('aria2.addUri', [
      [url],
      {
        out: filename,
        dir: aria2ConfigForm.value.dir === '' ? null : aria2ConfigForm.value.dir,
        header: [`User-Agent: ${ua}`],
        split: threadCount.toString(),
      },
    ])
    MessagePlugin.success('添加链接成功')
  }

  const downloadLinks = async (rows: DownloadRows, index = 0) => {
    for (const row of rows) {
      let filename = row.filename
      if (row.fs_id && fileListStore.GetFileListRes) {
        // 查询 path 参数
        const file = fileListStore.GetFileListRes.list.find((file) => file.fs_id === row.fs_id)
        if (file) filename = file.path
      }
      await addAria2Url(row.urls[index], filename, row.ua, 16)
    }
  }

  return {
    aria2ConfigDialogVisible,
    showAria2Config,
    hideAria2Config,
    aria2ConfigForm,
    saveAria2Config,

    getAria2Version,
    addAria2Url,
    downloadLinks,
  }
})
