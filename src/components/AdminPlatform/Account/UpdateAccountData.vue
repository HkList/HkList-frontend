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
      <t-form-item label="账号类型">
        <t-select v-model="updateAccountDataInfo.account_type">
          <t-option
            label="Cookie"
            value="cookie"
          />
          <t-option
            label="企业"
            value="enterprise_cokie"
          />
          <t-option
            label="开放平台"
            value="open_platform"
          />
          <t-option
            label="下载卷"
            value="download_ticket"
          />
        </t-select>
      </t-form-item>

      <template
        v-if="
          (updateAccountDataInfo.account_type === 'cookie' || updateAccountDataInfo.account_type === 'enterprise_cokie') &&
          'cookie' in updateAccountDataInfo.account_data
        "
      >
        <t-form-item
          label="Cookie"
          name="cookie"
        >
          <t-input v-model="updateAccountDataInfo.account_data.cookie" />
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
            @click="accountsStore.hideAddAccountDialog"
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
import { getUrlId } from '@/utils/getUrlId.ts'

const accountsStore = useAccountsStore()
const { isUpdatingAccountData, updateAccountDataInfo } = storeToRefs(accountsStore)

const formRules: FormProps['rules'] = {
  cookie: [{ required: true, message: 'Cookie不能为空' }],
  refresh_token: [{ required: true, message: 'RefreshToken不能为空' }],
  surl: [{ required: true, message: 'Surl不能为空' }],
  url: [{ required: true, message: '分享链接不能为空' }],
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
</script>

<style lang="scss" scoped></style>
