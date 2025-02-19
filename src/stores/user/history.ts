import { type GetHistoryReq, type GetHistoryRes, getHistory as _getHistory } from '@/api/user/history.ts'
import { type DownloadRows } from '@/stores/user/aria2'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const [selectReq, pagination, historyList, getHistory] = useCommonStore<GetHistoryReq, GetHistoryRes>(_getHistory, () => {
    selectedRows.value = []
    selectedRowKeys.value = []
  })

  const selectedRowKeys = ref<number[]>([])
  const selectedRows = ref<DownloadRows>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value as number[]
    selectedRows.value = (ctx.selectedRowData as GetHistoryRes[]).map((row) => ({ filename: row.file.filename, urls: row.urls, ua: row.ua }))
  }

  return {
    selectReq,
    pagination,
    historyList,
    getHistory,

    selectedRowKeys,
    selectedRows,
    handleSelectChange,
  }
})
