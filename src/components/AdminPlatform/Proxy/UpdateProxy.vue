<template>
  <t-dialog
    v-model:visible="isEditDialog"
    header="更新代理"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="updateReq"
      :rules="formRules"
    >
      <t-form-item label="选中的代理">
        <t-input
          :value="JSON.stringify(updateReq.id)"
          disabled
        />
      </t-form-item>

      <t-form-item
        name="enable"
        label="启用"
      >
        <t-switch v-model="updateReq.enable" />
      </t-form-item>

      <t-form-item
        name="reason"
        label="原因"
      >
        <t-input v-model="updateReq.reason" />
      </t-form-item>

      <template v-if="updateReq.id.length === 1">
        <t-form-item
          name="type"
          label="代理类型"
        >
          <t-select v-model="updateReq.type">
            <!-- <t-option
              label="HTTP静态代理"
              value="http"
            />
            <t-option
              label="API获取模式"
              value="api"
            /> -->
            <t-option
              label="中转代理"
              value="proxy"
            />
          </t-select>
        </t-form-item>

        <t-form-item
          name="proxy"
          label="代理信息"
          help="格式<host@password>例如:<http://a.com@hklist>"
        >
          <t-input v-model="updateReq.proxy" />
        </t-form-item>

        <t-form-item
          name="account_id"
          label="账号"
        >
          <t-select v-model="updateReq.account_id">
            <t-option
              v-for="account in accountList"
              :key="account.id"
              :label="account.baidu_name"
              :value="account.id"
            />
          </t-select>
        </t-form-item>
      </template>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="proxiesStore.hideEditDialog"
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
const { isEditDialog, updateReq } = storeToRefs(proxiesStore)

const accountsStore = useAccountsStore()
const { accountList, selectReq } = storeToRefs(accountsStore)

selectReq.value.size = 9999
accountsStore.getAccounts()

onUnmounted(() => {
  accountList.value = []
})

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await proxiesStore.updateSelection()
  proxiesStore.hideEditDialog()
}
</script>

<style lang="scss" scoped></style>
