<template>
  <t-dialog
    v-model:visible="isUpdateSwitchDialog"
    header="启用/禁用卡密"
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

      <t-form-item
        label="原因"
        name="reason"
      >
        <t-input v-model="updateSwitchReq.reason" />
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
            @click="tokensStore.hideUpdateSwitchDialog"
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
import { useTokensStore } from '@/stores/admin/tokens.ts'
import { storeToRefs } from 'pinia'

const tokensStore = useTokensStore()
const { isUpdateSwitchDialog, updateSwitchReq, selectedRowKeys } = storeToRefs(tokensStore)

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await tokensStore.updateSwitchSelection()
  tokensStore.hideUpdateSwitchDialog()
}
</script>

<style lang="scss" scoped></style>
