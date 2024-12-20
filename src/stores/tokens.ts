import { insert, remove, select, update, type InsertReq, type SelectReq, type SelectRes, type UpdateReq } from '@/api/admin/token.ts'
import { GB } from '@/utils/format.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useTokensStore = defineStore('tokens', () => {
  const [selectReq, pagination, tokenList, getTokens] = useCommonStore<SelectReq, SelectRes>(select)

  const selectedRowKeys = ref<number[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value) => {
    selectedRowKeys.value = value as number[]
  }

  const isAddingToken = ref(false)
  const showAddingTokenDialog = () => (isAddingToken.value = true)
  const hideAddingTokenDialog = () => (isAddingToken.value = false)
  const addingTokenReq = ref<InsertReq>({
    count: 100,
    size: 1000,
    day: 100,
    can_use_ip_count: 5,
    type: 'generate',
    generate_count: 10,
  })
  const addToken = async () => {
    await insert({
      ...addingTokenReq.value,
      size: addingTokenReq.value.size * GB,
    })
    MessagePlugin.success('添加成功')
    await getTokens()
  }

  const isUpdateSwitchDialog = ref(false)
  const showUpdateSwitchDialog = () => (isUpdateSwitchDialog.value = true)
  const hideUpdateSwitchDialog = () => (isUpdateSwitchDialog.value = false)

  const updateSwitchReq = ref<UpdateReq>({
    id: [],
    switch: true,
    reason: '手动操作',
  })
  const updateSwitchSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择卡密')
    await update({ ...updateSwitchReq.value, id: selectedRowKeys.value })
    MessagePlugin.success(`${updateSwitchReq.value.switch ? '启用' : '禁用'}成功`)
    await getTokens()
  }

  const deleteSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择卡密')
    await remove({ id: selectedRowKeys.value })
    MessagePlugin.success('删除成功')
    await getTokens()
  }

  const isEditDialog = ref(false)
  const updateReq = ref<UpdateReq>({
    id: [],
    count: 100,
    size: 1000,
    day: 100,
    can_use_ip_count: 5,
    ip: [],
    expires_at: null,
    switch: true,
    reason: '',
    token: undefined,
  })
  const showEditDialog = (event?: PointerEvent, id?: number) => {
    if (event && id) {
      event.stopPropagation()
      updateReq.value.id = [id]
    } else {
      updateReq.value = {
        id: selectedRowKeys.value,
        count: 100,
        size: 1000,
        day: 100,
        can_use_ip_count: 5,
        ip: [],
        expires_at: null,
        switch: true,
        reason: '',
        token: undefined,
      }
    }

    if (updateReq.value.id.length === 1) {
      const find = tokenList.value.find((item) => item.id === updateReq.value.id[0])
      if (find) {
        updateReq.value = {
          ...find,
          size: find.size / GB,
          id: updateReq.value.id,
        }
      }
    }

    isEditDialog.value = true
  }
  const hideEditDialog = () => (isEditDialog.value = false)
  const updateSelection = async () => {
    if (updateReq.value.id.length === 0) return MessagePlugin.error('请选择卡密')
    await update({
      ...updateReq.value,
      size: (updateReq.value.size ?? 0) * GB,
      token: updateReq.value.id.length === 1 && updateReq.value.token === 'guest' ? undefined : updateReq.value.token,
    })
    MessagePlugin.success('更新成功~')
    await getTokens()
  }

  return {
    tokenList,
    pagination,
    selectReq,
    getTokens,

    selectedRowKeys,
    handleSelectChange,

    isAddingToken,
    showAddingTokenDialog,
    hideAddingTokenDialog,
    addingTokenReq,
    addToken,

    isUpdateSwitchDialog,
    showUpdateSwitchDialog,
    hideUpdateSwitchDialog,
    updateSwitchReq,
    updateSwitchSelection,

    deleteSelection,

    isEditDialog,
    updateReq,
    showEditDialog,
    hideEditDialog,
    updateSelection,
  }
})
