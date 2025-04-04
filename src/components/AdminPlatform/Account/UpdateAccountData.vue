<template>
  <t-dialog
    v-model:visible="isUpdatingAccountData"
    header="编辑账号"
    :footer="false"
    :width="800"
  >
    <t-form
      :data="updateAccountDataInfo.account_data"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="130"
    >
      <template v-if="updateAccountDataInfo.account_type === 'cookie' && 'cookie' in updateAccountDataInfo.account_data">
        <t-form-item
          label="Cookie"
          name="cookie"
        >
          <t-textarea v-model="updateAccountDataInfo.account_data.cookie" />
        </t-form-item>
      </template>

      <template
        v-else-if="
          updateAccountDataInfo.account_type === 'enterprise_cookie' &&
          'cookie' in updateAccountDataInfo.account_data &&
          'dlink_cookie' in updateAccountDataInfo.account_data &&
          'cid' in updateAccountDataInfo.account_data
        "
      >
        <t-form-item
          label="Cookie"
          name="cookie"
        >
          <t-textarea v-model="updateAccountDataInfo.account_data.cookie" />
        </t-form-item>

        <t-form-item
          label="选择企业"
          name="选择CID"
        >
          <t-select
            v-model="updateAccountDataInfo.account_data.cid"
            v-if="accountCidInfo.length > 0"
          >
            <t-option
              v-for="item in accountCidInfo"
              :key="item.cid"
              :label="item.org_name"
              :value="item.cid"
            />
          </t-select>
          <span v-else> 请先填写Cookie </span>
        </t-form-item>

        <t-form-item
          label="企业ID"
          name="cid"
        >
          <t-input
            v-model="updateAccountDataInfo.account_data.cid"
            disabled
          />
        </t-form-item>

        <t-form-item
          label="额外普通号"
          name="dlink_cookie"
          help="可留空"
        >
          <t-textarea v-model="updateAccountDataInfo.account_data.dlink_cookie" />
        </t-form-item>
      </template>

      <template v-else-if="updateAccountDataInfo.account_type === 'open_platform' && 'refresh_token' in updateAccountDataInfo.account_data">
        <t-form-item
          label="RefreshToken"
          name="refresh_token"
        >
          <t-input v-model="updateAccountDataInfo.account_data.refresh_token" />
        </t-form-item>
      </template>

      <template v-else-if="updateAccountDataInfo.account_type === 'download_ticket' && 'surl' in updateAccountDataInfo.account_data">
        <t-form-item
          label="分享链接"
          name="url"
        >
          <t-input
            v-model="urlRef"
            @blur="parseUrl"
          />
        </t-form-item>

        <t-form-item
          label="Surl"
          name="surl"
        >
          <t-input
            v-model="updateAccountDataInfo.account_data.surl"
            disabled
          />
        </t-form-item>

        <t-form-item
          label="提取码"
          name="pwd"
        >
          <t-input v-model="updateAccountDataInfo.account_data.pwd" />
        </t-form-item>

        <t-form-item
          label="文件夹名称"
          name="dir"
          help="以/打头,需要提前创建该文件夹"
        >
          <t-input v-model="updateAccountDataInfo.account_data.dir" />
        </t-form-item>

        <t-form-item
          label="企业号CK"
          name="save_cookie"
        >
          <t-textarea v-model="updateAccountDataInfo.account_data.save_cookie" />
        </t-form-item>

        <t-form-item
          label="选择企业"
          name="选择CID"
        >
          <t-select
            v-model="updateAccountDataInfo.account_data.cid"
            v-if="accountCidInfo.length > 0"
          >
            <t-option
              v-for="item in accountCidInfo"
              :key="item.cid"
              :label="item.org_name"
              :value="item.cid"
            />
          </t-select>
          <span v-else> 请先填写Cookie </span>
        </t-form-item>

        <t-form-item
          label="企业ID"
          name="cid"
        >
          <t-input
            v-model="updateAccountDataInfo.account_data.cid"
            disabled
          />
        </t-form-item>

        <t-form-item
          label="普通号CK"
          name="download_cookie"
        >
          <t-textarea v-model="updateAccountDataInfo.account_data.download_cookie" />
        </t-form-item>
      </template>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="accountsStore.hideUpdateAccountDataDialog"
          >
            取消
          </t-button>
          <t-button type="submit"> 提交 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
import { useAccountsStore } from '@/stores/admin/accounts.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { getUrlId } from '@/utils/getUrlId.ts'
import { watch } from 'vue'
import { getAccountCidInfo, type GetAccountCidRes } from '@/api/admin/account.ts'

const accountsStore = useAccountsStore()
const { isUpdatingAccountData, updateAccountDataInfo } = storeToRefs(accountsStore)

const formRules: FormProps['rules'] = {
  cookie: [{ required: true, message: 'Cookie不能为空' }],
  refresh_token: [{ required: true, message: 'RefreshToken不能为空' }],
  surl: [{ required: true, message: 'Surl不能为空' }],
  pwd: [{ required: true, message: '链接密码不能为空' }],
  dir: [{ required: true, message: '盘内路径不能为空' }],
  save_cookie: [{ required: true, message: '企业号CK不能为空' }],
  download_cookie: [{ required: true, message: '普通号CK不能为空' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await accountsStore.updateAccountData()
  accountsStore.hideUpdateAccountDataDialog()
}

const urlRef = ref('')
const accountCidInfo = ref<GetAccountCidRes>([])

watch(updateAccountDataInfo, async (accountInfo) => {
  urlRef.value = ''
  accountCidInfo.value = []

  if (accountInfo.account_type === 'download_ticket' && 'surl' in accountInfo.account_data && 'save_cookie' in accountInfo.account_data) {
    urlRef.value = `https://pan.baidu.com/s/${accountInfo.account_data.surl}`
    const res = await getAccountCidInfo({ cookie: accountInfo.account_data.save_cookie })
    accountCidInfo.value = res.data
  }

  if (accountInfo.account_type === 'enterprise_cookie' && 'cookie' in accountInfo.account_data) {
    const res = await getAccountCidInfo({ cookie: accountInfo.account_data.cookie })
    accountCidInfo.value = res.data
  }
})

const parseUrl = () => {
  const res = getUrlId(urlRef.value)
  if (!res) return

  const { surl, pwd } = res
  if ('surl' in updateAccountDataInfo.value.account_data) {
    updateAccountDataInfo.value.account_data.surl = surl
    if (pwd) {
      updateAccountDataInfo.value.account_data.pwd = pwd
      MessagePlugin.success('已自动填写密码~')
    }
  }
}
</script>

<style lang="scss" scoped></style>
