<template>
  <t-dialog
    v-model:visible="isUpdateSwitch"
    header="更新账号"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="updateSwitchReq"
      :rules="formRules"
    >
      <t-form-item
        label="启用"
        name="switch"
      >
        <t-switch v-model="updateSwitchReq.switch" />
      </t-form-item>

      <t-form-item label="选中的账号">
        <t-input
          :value="JSON.stringify(selectedRowKeys)"
          disabled
        />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="accountsStore.hideUpdateSwitchDialog"
          >
            取消
          </t-button>
          <t-button
            theme="primary"
            type="submit"
          >
            提交
          </t-button>
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
const { isUpdateSwitch, updateSwitchReq, selectedRowKeys } = storeToRefs(accountsStore)

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await accountsStore.updateSwitch()
  accountsStore.hideUpdateSwitchDialog()
}
</script>

<style lang="scss" scoped></style>
