<template>
  <t-dialog
    v-model:visible="isAddingProxy"
    header="添加卡密"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="addProxyReq"
      :rules="formRules"
    >
      <t-form-item
        name="type"
        label="代理类型"
      >
        <t-select v-model="addProxyReq.type">
          <t-option
            label="HTTP静态代理"
            value="http"
          />
          <t-option
            label="API动态代理"
            value="api"
          />
          <t-option
            label="中转代理(ip@password)"
            value="proxy"
          />
        </t-select>
      </t-form-item>

      <t-form-item
        name="proxy"
        label="代理信息"
      >
        <t-input v-model="addProxyReq.proxy" />
      </t-form-item>

      <t-form-item
        name="account_id"
        label="账号"
      >
        <t-select v-model="addProxyReq.account_id">
          <t-option
            v-for="account in accountList"
            :key="account.id"
            :label="account.baidu_name"
            :value="account.id"
          />
        </t-select>
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="proxiesStore.hideAddingProxyDialog"
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
import { type FormProps } from 'tdesign-vue-next'
import { useProxiesStore } from '@/stores/admin/proxies.ts'
import { useAccountsStore } from '@/stores/admin/accounts.ts'
import { storeToRefs } from 'pinia'
import { onUnmounted } from 'vue'

const proxiesStore = useProxiesStore()
const { isAddingProxy, addProxyReq } = storeToRefs(proxiesStore)

const accountsStore = useAccountsStore()
const { accountList, selectReq } = storeToRefs(accountsStore)

selectReq.value.size = 9999
accountsStore.getAccounts()

onUnmounted(() => {
  accountList.value = []
})

const formRules: FormProps['rules'] = {
  type: [{ required: true, message: '请选择代理类型' }],
  proxy: [{ required: true, message: '请输入代理信息' }],
  account_id: [{ required: true, message: '请选择账号' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await proxiesStore.addProxy()
  proxiesStore.hideAddingProxyDialog()
}
</script>

<style lang="scss" scoped></style>
