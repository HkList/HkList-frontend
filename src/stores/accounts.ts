import {
  insert,
  remove,
  select,
  update,
  updateInfo,
  checkBanStatus,
  type InsertReq,
  type SelectReq,
  type SelectRes,
  type UpdateReq,
} from '@/api/admin/account.ts'
import { formatTimestamp } from '@/utils/format.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useAccountsStore = defineStore('accounts', () => {
  const [selectReq, pagination, accountList, getAccounts] = useCommonStore<SelectReq, SelectRes>(
    select,
  )

  const selectedRowKeys = ref<number[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value, ctx) => {
    selectedRowKeys.value = value as number[]
  }

  const updateInfoSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await updateInfo({ id: selectedRowKeys.value })
    MessagePlugin.success('更新成功')
    await getAccounts()
  }

  const enableSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await update({ id: selectedRowKeys.value, switch: true })
    MessagePlugin.success('启用成功')
    await getAccounts()
  }

  const disableSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await update({ id: selectedRowKeys.value, switch: false })
    MessagePlugin.success('禁用成功')
    await getAccounts()
  }

  const deleteSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await remove({ id: selectedRowKeys.value })
    MessagePlugin.success('删除成功')
    await getAccounts()
  }

  const isUpdateProvDialog = ref(false)
  const showUpdateProvDialog = () => (isUpdateProvDialog.value = true)
  const hideUpdateProvDialog = () => (isUpdateProvDialog.value = false)
  const selectedProv = ref<UpdateReq['prov']>(null)
  const updateProvSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await update({ id: selectedRowKeys.value, prov: selectedProv.value })
    MessagePlugin.success('更新省份成功')
    await getAccounts()
  }

  const isAddingAccount = ref(false)
  const showAddDialog = () => (isAddingAccount.value = true)
  const hideAddDialog = async () => (isAddingAccount.value = false)
  const addAccountType = ref<InsertReq['account_type']>('cookie')
  const addAccountInput = ref({
    cookie: '',
    refresh_token: '',
    surl: '',
    pwd: '',
    dir: '',
    save_cookie: '',
    download_cookie: '',
  })
  const addAccount = async () => {
    const req: InsertReq = {
      account_type: addAccountType.value,
      account_data: [],
    }
    if (addAccountType.value === 'cookie') {
      req.account_data = [{ cookie: addAccountInput.value.cookie }]
    } else if (addAccountType.value === 'enterprise_cokie') {
      req.account_data = [{ cookie: addAccountInput.value.cookie }]
    } else if (addAccountType.value === 'open_platform') {
      req.account_data = [{ refresh_token: addAccountInput.value.refresh_token }]
    } else if (addAccountType.value === 'download_ticket') {
      req.account_data = [
        {
          surl: addAccountInput.value.surl,
          pwd: addAccountInput.value.pwd,
          dir: addAccountInput.value.dir,
          save_cookie: addAccountInput.value.save_cookie,
          download_cookie: addAccountInput.value.download_cookie,
        },
      ]
    }
    await insert(req)
    MessagePlugin.success('插入成功~')
    addAccountInput.value = {
      cookie: '',
      refresh_token: '',
      surl: '',
      pwd: '',
      dir: '',
      save_cookie: '',
      download_cookie: '',
    }
    await getAccounts()
  }

  const checkAccountBanStatus = async (event: PointerEvent, id: number) => {
    event.stopPropagation()
    const res = await checkBanStatus({ id: [id] })
    res.data.forEach((account) => {
      account.status.forEach((status) => {
        if (status.code !== 200) return MessagePlugin.error(`账号(${account.id})状态请求失败`)
        if (!status.data.ban_status) return MessagePlugin.success(`账号(${account.id})未被封禁`)
        MessagePlugin.warning(`账号(${account.id})已被封禁`)
        MessagePlugin.warning(`原因: ${status.data.ban_reason}`)
        MessagePlugin.warning(`消息: ${status.data.ban_msg}`)
        MessagePlugin.warning(`开始时间: ${formatTimestamp(status.data.start_time)}`)
        MessagePlugin.warning(`结束时间: ${formatTimestamp(status.data.end_time)}`)
      })
    })
  }

  return {
    accountList,
    pagination,
    selectReq,
    getAccounts,

    selectedRowKeys,
    handleSelectChange,

    deleteSelection,
    enableSelection,
    disableSelection,
    updateInfoSelection,

    selectedProv,
    isUpdateProvDialog,
    showUpdateProvDialog,
    hideUpdateProvDialog,
    updateProvSelection,

    isAddingAccount,
    addAccountType,
    addAccountInput,
    showAddDialog,
    hideAddDialog,
    addAccount,

    checkAccountBanStatus,
  }
})
