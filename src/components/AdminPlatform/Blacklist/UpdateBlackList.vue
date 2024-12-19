<template>
  <t-dialog
    v-model:visible="isUpdate"
    header="更新黑名单"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="updateReq"
      :rules="formRules"
    >
      <template v-if="updateReq.id.length === 1">
        <t-form-item
          label="类型"
          name="type"
        >
          <t-select v-model="updateReq.type">
            <t-option
              label="指纹"
              value="fingerprint"
            />
            <t-option
              label="IP"
              value="ip"
            />
          </t-select>
        </t-form-item>

        <t-form-item
          label="识别码"
          name="identifier"
        >
          <t-input v-model="updateReq.identifier" />
        </t-form-item>
      </template>

      <t-form-item
        label="原因"
        name="reason"
      >
        <t-input v-model="updateReq.reason" />
      </t-form-item>

      <t-form-item
        label="到期时间"
        name="expires_at"
      >
        <t-date-picker
          v-model="updateReq.expires_at"
          enable-time-picker
          allow-input
          clearable
          format="YYYY-MM-DD hh:mm:ss"
        />
      </t-form-item>

      <t-form-item label="选中的账号">
        <t-input
          :value="JSON.stringify(updateReq.id)"
          disabled
        />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="blacksStore.hideUpdateDialog"
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
import { type CustomValidator, type FormProps } from 'tdesign-vue-next'
import { useBlackListsStore } from '@/stores/blackLists.ts'
import { storeToRefs } from 'pinia'
import { ValidateIsIp } from '@/utils/validates.ts'

const blacksStore = useBlackListsStore()
const { isUpdate, updateReq } = storeToRefs(blacksStore)

const checkIdentifier: CustomValidator = () => {
  if (updateReq.value.type === 'ip' && updateReq.value.identifier && !ValidateIsIp(updateReq.value.identifier)) {
    return {
      result: false,
      message: '请输入正确的IP地址',
      type: 'error',
    }
  }
  return true
}

const formRules: FormProps['rules'] = {
  identifier: [{ required: true, message: '请输入识别码' }, { validator: checkIdentifier }],
  reason: [{ required: true, message: '请输入原因' }],
  expires_at: [{ required: true, message: '请选择到期时间' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await blacksStore.updateSelection()
  blacksStore.hideUpdateDialog()
}
</script>

<style lang="scss" scoped></style>
