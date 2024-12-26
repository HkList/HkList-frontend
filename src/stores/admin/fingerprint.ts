import { select, type SelectReq, type SelectRes } from '@/api/admin/fingerprint.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'

export const useFingerprintStore = defineStore('fingerprint', () => {
  const [selectReq, pagination, fingerprintList, getFingerprint] = useCommonStore<SelectReq, SelectRes>(select)

  return {
    pagination,
    selectReq,
    fingerprintList,
    getFingerprint,
  }
})
