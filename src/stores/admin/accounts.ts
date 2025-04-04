import {
  checkBanStatus,
  insert,
  remove,
  select,
  update,
  updateData,
  updateInfo,
  type InsertReq,
  type SelectReq,
  type SelectRes,
  type SingleAccount,
  type UpdateData,
  type UpdateReq,
} from '@/api/admin/account.ts'
import { formatTimestamp } from '@/utils/format.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { defineStore } from 'pinia'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'

export const useAccountsStore = defineStore('accounts', () => {
  const [selectReq, pagination, accountList, getAccounts] = useCommonStore<SelectReq, SelectRes>(select, () => {
    selectedRowKeys.value = []
  })

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
    selectedRowKeys.value = []
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
    cid: 0,
    refresh_token: '',
    url: '',
    surl: '',
    pwd: '',
    dir: '',
    save_cookie: '',
    download_cookie: '',
    dlink_cookie: '',
  })
  const addAccount = async () => {
    const req: InsertReq = {
      account_type: addAccountType.value,
      account_data: [],
    }

    const { cookie, refresh_token, surl, pwd, dir, save_cookie, download_cookie, dlink_cookie, cid } = addAccountInput.value

    if (addAccountType.value === 'cookie') {
      req.account_data = [{ cookie }]
    } else if (addAccountType.value === 'enterprise_cookie') {
      req.account_data = [{ cookie, dlink_cookie, cid }]
    } else if (addAccountType.value === 'open_platform') {
      req.account_data = [{ refresh_token }]
    } else if (addAccountType.value === 'download_ticket') {
      req.account_data = [{ surl, pwd, dir, save_cookie, download_cookie, cid }]
    }

    await insert(req)

    MessagePlugin.success('插入成功~')
    addAccountInput.value = {
      cookie: '',
      refresh_token: '',
      cid: 0,
      url: '',
      surl: '',
      pwd: '',
      dir: '',
      save_cookie: '',
      download_cookie: '',
      dlink_cookie: '',
    }
    await getAccounts()
  }

  const checkAccountBanStatus = async (event: PointerEvent, id: number) => {
    event.stopPropagation()
    const res = await checkBanStatus({ id: [id] })
    res.data.forEach((account) => {
      account.status.forEach((status, index) => {
        let key = '账号'
        if (account.account_type === 'download_ticket') key = index === 0 ? `企业账号` : `普通账号`
        if (status.code !== 200) return MessagePlugin.error(`${key}(${account.id})${status.message}`)
        if (!status.data.ban_status) return MessagePlugin.success(`${key}(${account.id})未被封禁`)
        MessagePlugin.warning(`${key}(${account.id})已被封禁`)
        MessagePlugin.warning(`原因: ${status.data.ban_reason}`)
        MessagePlugin.warning(`消息: ${status.data.ban_msg}`)
        MessagePlugin.warning(`开始时间: ${formatTimestamp(status.data.start_time)}`)
        MessagePlugin.warning(`结束时间: ${formatTimestamp(status.data.end_time)}`)
      })
    })
  }

  const updateAccountDataInfo = ref<UpdateData>({
    id: [],
    account_type: 'cookie',
    account_data: {
      cookie: '',
      vip_type: '普通用户',
      expires_at: '',
    },
  })
  const isUpdatingAccountData = ref(false)
  const showUpdateAccountDataDialog = (event: PointerEvent, account: SingleAccount) => {
    event.stopPropagation()

    updateAccountDataInfo.value = {
      id: [account.id],
      account_type: account.account_type,
      account_data: account.account_data,
    }

    isUpdatingAccountData.value = true
  }
  const hideUpdateAccountDataDialog = () => {
    isUpdatingAccountData.value = false
  }
  const updateAccountData = async () => {
    await updateData(updateAccountDataInfo.value)
    MessagePlugin.success('编辑账户信息成功')
    await updateInfo({ id: updateAccountDataInfo.value.id })
    MessagePlugin.success('更新账户信息成功')
    await getAccounts()
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

    updateAccountDataInfo,
    isUpdatingAccountData,
    showUpdateAccountDataDialog,
    hideUpdateAccountDataDialog,
    updateAccountData,
  }
})
