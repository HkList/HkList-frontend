import { insert, remove, select, update, type InsertReq, type SelectReq, type SelectRes, type UpdateReq } from '@/api/admin/black_list.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useBlackListsStore = defineStore('blackLists', () => {
  const [selectReq, pagination, blackList, getBlackLists] = useCommonStore<SelectReq, SelectRes>(select)

  const selectedRowKeys = ref<number[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value) => {
    selectedRowKeys.value = value as number[]
  }

  const deleteSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择黑名单')
    await remove({ id: selectedRowKeys.value })
    MessagePlugin.success('删除成功')
    await getBlackLists()
  }

  const isUpdate = ref(false)
  const updateReq = ref<UpdateReq>({
    id: [],
    type: undefined,
    identifier: undefined,
    reason: '',
    expires_at: '',
  })
  const showUpdateDialog = (event?: PointerEvent, id?: number) => {
    if (event && id) {
      event.stopPropagation()
      updateReq.value.id = [id]
    } else {
      updateReq.value = {
        id: selectedRowKeys.value,
        type: undefined,
        identifier: undefined,
        reason: '',
        expires_at: '',
      }
    }

    if (updateReq.value.id.length === 1) {
      const find = blackList.value.find((item) => item.id === updateReq.value.id[0])
      if (find) {
        updateReq.value = {
          ...find,
          id: updateReq.value.id,
        }
      }
    }

    isUpdate.value = true
  }
  const hideUpdateDialog = () => (isUpdate.value = false)
  const updateSelection = async () => {
    if (updateReq.value.id.length === 0) return MessagePlugin.error('请选择黑名单')
    await update({ ...updateReq.value, id: selectedRowKeys.value })
    MessagePlugin.success('更新成功')
    await getBlackLists()
  }

  const isAddBlackList = ref(false)
  const addBlackListReq = ref<InsertReq>({
    type: 'fingerprint',
    identifier: '',
    reason: '',
    ban_days: 10,
  })
  const showAddBlackList = () => (isAddBlackList.value = true)
  const hideAddBlackList = () => (isAddBlackList.value = false)
  const addBlackList = async () => {
    await insert(addBlackListReq.value)
    MessagePlugin.success('插入成功~')
    await getBlackLists()
  }

  return {
    pagination,
    selectReq,
    blackList,
    getBlackLists,

    selectedRowKeys,
    handleSelectChange,

    deleteSelection,

    isUpdate,
    updateReq,
    showUpdateDialog,
    hideUpdateDialog,
    updateSelection,

    isAddBlackList,
    addBlackListReq,
    showAddBlackList,
    hideAddBlackList,
    addBlackList,
  }
})
