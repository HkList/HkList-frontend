import type { BasePagenation } from '@/api/pagenation.ts'
import type { BaseResponse } from '@/utils/http.ts'
import type { TableProps, TdPaginationProps } from 'tdesign-vue-next'
import { ref, type Ref } from 'vue'

export const useCommonStore = <SelectReq, SelectRes>(
  select: (param: SelectReq) => Promise<BaseResponse<BasePagenation<SelectRes>>>,
  onChange?: TdPaginationProps['onChange'],
  extraReq: Partial<SelectReq> = {},
) => {
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
      if (onChange) onChange(pageInfo)
    },
  })

  const selectReq = ref<SelectReq>({
    page: pagination.value?.current ?? 1,
    size: pagination.value?.pageSize ?? 5,
    ...extraReq,
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
