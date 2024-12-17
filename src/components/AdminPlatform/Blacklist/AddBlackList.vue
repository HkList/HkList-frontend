<template>
  <t-dialog
    v-model:visible="isAddBlackList"
    header="添加黑名单"
    :footer="false"
  >
    <t-form
      :data="addBlackListReq"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="130"
    >
      <t-form-item
        label="类型"
        name="type"
      >
        <t-select v-model="addBlackListReq.type">
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
        <t-input v-model="addBlackListReq.identifier" />
      </t-form-item>

      <t-form-item
        label="原因"
        name="reason"
      >
        <t-input v-model="addBlackListReq.reason" />
      </t-form-item>

      <t-form-item
        label="封禁天数"
        name="ban_days"
      >
        <t-input-number
          :min="0"
          v-model="addBlackListReq.ban_days"
        />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="blacksStore.hideAddBlackList"
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
import { useBlackListsStore } from '@/stores/blackLists.ts'
import { storeToRefs } from 'pinia'

const blacksStore = useBlackListsStore()
const { isAddBlackList, addBlackListReq } = storeToRefs(blacksStore)

const formRules: FormProps['rules'] = {
  type: [{ required: true, message: '请选择类型' }],
  identifier: [{ required: true, message: '请输入识别码' }],
  reason: [{ required: true, message: '请输入原因' }],
  ban_days: [{ required: true, message: '请输入封禁天数' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await blacksStore.addBlackList()
}
</script>

<style lang="scss" scoped></style>
