<template>
  <t-dialog
    v-model:visible="isAddAccount"
    header="添加账号"
    :footer="false"
    :width="800"
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
          label="分享链接"
          name="url"
          help="链接需要对应下方填入的文件夹名称"
        >
          <t-input
            v-model="addAccountInput.url"
            @blur="parseUrl"
          />
        </t-form-item>

        <t-form-item
          label="Surl"
          name="surl"
        >
          <t-input
            v-model="addAccountInput.surl"
            disabled
          />
        </t-form-item>

        <t-form-item
          label="提取码"
          name="pwd"
        >
          <t-input v-model="addAccountInput.pwd" />
        </t-form-item>

        <t-form-item
          label="文件夹名称"
          name="dir"
          help="以/打头,需要提前创建该文件夹"
        >
          <t-input v-model="addAccountInput.dir" />
        </t-form-item>

        <t-form-item
          label="企业号CK"
          name="save_cookie"
        >
          <t-textarea v-model="addAccountInput.save_cookie" />
        </t-form-item>

        <t-form-item
          label="普通号CK"
          name="download_cookie"
        >
          <t-textarea v-model="addAccountInput.download_cookie" />
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
const { isAddAccount, addAccountType, addAccountInput } = storeToRefs(accountsStore)

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
  await accountsStore.addAccount()
}

const parseUrl = () => {
  const res = getUrlId(addAccountInput.value.url)
  if (!res) return

  const { surl, pwd, url } = res
  addAccountInput.value.surl = surl
  addAccountInput.value.url = url
  addAccountInput.value.dir = '/'
  if (pwd) {
    addAccountInput.value.pwd = pwd
    MessagePlugin.success('已自动填写密码~')
  }
}
</script>

<style lang="scss" scoped></style>
