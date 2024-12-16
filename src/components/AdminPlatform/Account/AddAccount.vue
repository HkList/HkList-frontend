<template>
  <t-dialog
    v-model:visible="isAddAccount"
    header="添加账号"
    :footer="false"
  >
    <t-form
      :data="addAccountInput"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="130"
    >
      <t-form-item label="账号类型">
        <t-select v-model="addAccountType">
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

      <template v-if="addAccountType === 'cookie' || addAccountType === 'enterprise_cokie'">
        <t-form-item
          label="Cookie"
          name="cookie"
        >
          <t-input v-model="addAccountInput.cookie" />
        </t-form-item>
      </template>
      <template v-else-if="addAccountType === 'open_platform'">
        <t-form-item
          label="RefreshToken"
          name="refresh_token"
        >
          <t-input v-model="addAccountInput.refresh_token" />
        </t-form-item>
      </template>
      <template v-else-if="addAccountType === 'download_ticket'">
        <t-form-item
          label="Surl"
          name="surl"
          help="分享链接"
        >
          <t-input v-model="addAccountInput.surl" />
        </t-form-item>

        <t-form-item
          label="Pwd"
          name="pwd"
          help="链接密码"
        >
          <t-input v-model="addAccountInput.pwd" />
        </t-form-item>

        <t-form-item
          label="Dir"
          name="dir"
          help="盘内路径"
        >
          <t-input v-model="addAccountInput.dir" />
        </t-form-item>

        <t-form-item
          label="SaveCookie"
          name="save_cookie"
          help="企业号CK"
        >
          <t-textarea v-model="addAccountInput.save_cookie" />
        </t-form-item>

        <t-form-item
          label="DownloadCookie"
          name="download_cookie"
          help="普通号CK"
        >
          <t-textarea v-model="addAccountInput.download_cookie" />
        </t-form-item>
      </template>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="accountsStore.hideAddAccountDialog"
            >取消</t-button
          >
          <t-button
            theme="primary"
            type="submit"
            >提交</t-button
          >
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { type FormProps } from 'tdesign-vue-next'
import { useAccountsStore } from '@/stores/accounts.ts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { isAddAccount, addAccountType, addAccountInput } = storeToRefs(accountsStore)

const formRules: FormProps['rules'] = {
  cookie: [{ required: true, message: 'Cookie不能为空' }],
  refresh_token: [{ required: true, message: 'RefreshToken不能为空' }],
  surl: [{ required: true, message: '分享链接不能为空' }],
  pwd: [{ required: true, message: '链接密码不能为空' }],
  dir: [{ required: true, message: '盘内路径不能为空' }],
  save_cookie: [{ required: true, message: '企业号CK不能为空' }],
  download_cookie: [{ required: true, message: '普通号CK不能为空' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await accountsStore.addAccount()
}
</script>

<style lang="scss" scoped></style>
