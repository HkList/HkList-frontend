import { select, type SelectReq, type SelectRes } from '@/api/admin/record.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'

export const useRecordsStore = defineStore('records', () => {
  const [selectReq, pagination, recordList, getRecords] = useCommonStore<SelectReq, SelectRes>(select)

  return {
    pagination,
    selectReq,
    recordList,
    getRecords,
  }
})
