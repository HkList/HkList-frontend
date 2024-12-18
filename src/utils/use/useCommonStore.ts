import type { TableProps } from 'tdesign-vue-next'
import { ref, type Ref } from 'vue'
import type { baseResponse } from '@/utils/http.ts'
import type { BasePagenation } from '@/api/pagenation.ts'

export const useCommonStore = <SelectReq, SelectRes>(select: (param: SelectReq) => Promise<baseResponse<BasePagenation<SelectRes>>>) => {
  const list = ref<SelectRes>([] as SelectRes)

  const pagination = ref<TableProps['pagination']>({
    current: 1,
    pageSize: 5,
    total: 0,
    onChange: (pageInfo) => {
      pagination.value!.current = pageInfo.current
      pagination.value!.pageSize = pageInfo.pageSize
      selectReq.value.page = pageInfo.current
      selectReq.value.size = pageInfo.pageSize
      get()
    },
  })

  const selectReq = ref<SelectReq>({
    page: pagination.value?.current ?? 1,
    size: pagination.value?.pageSize ?? 5,
    column: 'id',
    direction: 'asc',
  } as SelectReq)

  const get = async () => {
    const res = await select(selectReq.value)
    list.value = res.data.data
    pagination.value!.total = res.data.total
  }

  return [selectReq, pagination, list, get] as [Ref<SelectReq>, Ref<TableProps['pagination']>, Ref<SelectRes>, () => Promise<void>]
}
