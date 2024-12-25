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
  const [selectReq, pagination, accountList, getAccounts] = useCommonStore<SelectReq, SelectRes>(select)

  const selectedRowKeys = ref<number[]>([])
  const handleSelectChange: TableProps['onSelectChange'] = (value) => {
    selectedRowKeys.value = value as number[]
  }

  const updateInfoSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await updateInfo({ id: selectedRowKeys.value })
    MessagePlugin.success('更新成功')
    await getAccounts()
  }

  const deleteSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await remove({ id: selectedRowKeys.value })
    MessagePlugin.success('删除成功')
    await getAccounts()
  }

  const isUpdateSwitch = ref(false)
  const updateSwitchReq = ref<UpdateReq>({
    id: [],
    switch: false,
  })
  const showUpdateSwitchDialog = () => (isUpdateSwitch.value = true)
  const hideUpdateSwitchDialog = () => (isUpdateSwitch.value = false)
  const updateSwitch = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await update({ ...updateSwitchReq.value, id: selectedRowKeys.value })
    MessagePlugin.success('更新成功')
    await getAccounts()
  }

  const isUpdateProvDialog = ref(false)
  const showUpdateProvDialog = () => (isUpdateProvDialog.value = true)
  const hideUpdateProvDialog = () => (isUpdateProvDialog.value = false)
  const updateProvReq = ref<UpdateReq>({
    id: [],
    prov: null,
  })
  const updateProvSelection = async () => {
    if (selectedRowKeys.value.length === 0) return MessagePlugin.error('请选择账号')
    await update({ ...updateProvReq.value, id: selectedRowKeys.value })
    MessagePlugin.success('更新省份成功')
    await getAccounts()
  }

  const isAddAccount = ref(false)
  const showAddAccountDialog = () => (isAddAccount.value = true)
  const hideAddAccountDialog = async () => (isAddAccount.value = false)
  const addAccountType = ref<InsertReq['account_type']>('cookie')
  const addAccountInput = ref({
    cookie: '',
    refresh_token: '',
    url: '',
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
      url: '',
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
      account.status.forEach((status, index) => {
        if (status.code !== 200) return MessagePlugin.error(`账号(${account.id})状态请求失败`)
        let key = '账号'
        if (account.account_type === 'download_ticket') key = index === 0 ? `企业账号` : `普通账号`
        if (!status.data.ban_status) return MessagePlugin.success(`${key}(${account.id})未被封禁`)
        MessagePlugin.warning(`${key}(${account.id})已被封禁`)
        MessagePlugin.warning(`原因: ${status.data.ban_reason}`)
        MessagePlugin.warning(`消息: ${status.data.ban_msg}`)
        MessagePlugin.warning(`开始时间: ${formatTimestamp(status.data.start_time)}`)
        MessagePlugin.warning(`结束时间: ${formatTimestamp(status.data.end_time)}`)
      })
    })
  }

  return {
    pagination,
    selectReq,
    accountList,
    getAccounts,

    selectedRowKeys,
    handleSelectChange,

    updateInfoSelection,
    deleteSelection,

    isUpdateSwitch,
    updateSwitchReq,
    showUpdateSwitchDialog,
    hideUpdateSwitchDialog,
    updateSwitch,

    isUpdateProvDialog,
    updateProvReq,
    showUpdateProvDialog,
    hideUpdateProvDialog,
    updateProvSelection,

    isAddAccount,
    addAccountType,
    addAccountInput,
    showAddAccountDialog,
    hideAddAccountDialog,
    addAccount,

    checkAccountBanStatus,
  }
})
