import { insert, remove, select, update, type InsertReq, type SelectReq, type SelectRes, type UpdateReq } from '@/api/admin/proxy.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useProxiesStore = defineStore('proxies', () => {
  const [selectReq, pagination, proxyList, getProxies] = useCommonStore<SelectReq, SelectRes>(
    select,
    () => {
      selectedRowKeys.value = []
      selectedRows.value = []
    },
    { keyword: '' },
  )

  const selectedRowKeys = ref<number[]>([])
  const selectedRows = ref<SelectRes>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value as number[]
    selectedRows.value = ctx.selectedRowData as SelectRes
  }

  const isAddingProxy = ref(false)
  const showAddingProxyDialog = () => (isAddingProxy.value = true)
  const hideAddingProxyDialog = () => {
    isAddingProxy.value = false
    addProxyReq.value = {
      type: 'http',
      proxy: '',
      account_id: undefined,
    }
  }
  const addProxyReq = ref<InsertReq>({
    type: 'http',
    proxy: '',
    account_id: undefined,
  })
  const addProxy = async () => {
    await insert(addProxyReq.value)
    MessagePlugin.success('添加成功')
    await getProxies()
  }

  const deleteSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择代理')
    await remove({ id: selectedRowKeys.value })
    selectedRowKeys.value = []
    MessagePlugin.success('删除成功')
    await getProxies()
  }

  const isEditDialog = ref(false)
  const updateReq = ref<UpdateReq>({
    id: [],
    enable: true,
    reason: '',
    type: 'http',
    proxy: '',
  })
  const showEditDialog = (event?: PointerEvent, id?: number) => {
    if (event && id) {
      event.stopPropagation()
      updateReq.value.id = [id]
    } else {
      updateReq.value = {
        id: selectedRowKeys.value,
        enable: true,
        reason: '',
      }
    }

    if (updateReq.value.id.length === 1) {
      const find = proxyList.value.find((item) => item.id === updateReq.value.id[0])
      if (find) {
        updateReq.value = {
          id: [find.id],
          enable: find.enable,
          reason: find.reason,
          type: find.type,
          proxy: find.proxy,
          account_id: find.account_id,
        }
      }
    }

    isEditDialog.value = true
  }
  const hideEditDialog = () => (isEditDialog.value = false)
  const updateSelection = async () => {
    if (updateReq.value.id.length === 0) return MessagePlugin.error('请选择卡密')
    await update(updateReq.value)
    MessagePlugin.success('更新成功~')
    await getProxies()
  }

  return {
    proxyList,
    pagination,
    selectReq,
    getProxies,

    selectedRowKeys,
    handleSelectChange,

    isAddingProxy,
    showAddingProxyDialog,
    hideAddingProxyDialog,
    addProxyReq,
    addProxy,

    isEditDialog,
    updateReq,
    showEditDialog,
    hideEditDialog,
    updateSelection,

    deleteSelection,
  }
})
