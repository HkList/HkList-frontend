<template>
  <t-dialog
    v-model:visible="isEditDialog"
    header="更新卡密"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="updateReq"
      :rules="formRules"
    >
      <t-form-item
        name="token"
        label="卡密"
        v-if="updateReq.id.length === 1 && updateReq.token !== 'guest'"
      >
        <t-input v-model="updateReq.token" />
      </t-form-item>

      <t-form-item
        name="count"
        label="次数配额"
      >
        <t-input-number
          :min="1"
          v-model="updateReq.count"
        />
      </t-form-item>

      <t-form-item
        name="size"
        label="大小配额(GB)"
      >
        <t-input-number
          :min="1"
          v-model="updateReq.size"
        />
      </t-form-item>

      <t-form-item
        name="day"
        label="时间配额"
      >
        <t-input-number
          :min="1"
          v-model="updateReq.day"
        />
      </t-form-item>

      <t-form-item
        name="can_use_ip_count"
        label="IP配额"
      >
        <t-input-number
          :min="1"
          v-model="updateReq.can_use_ip_count"
        />
      </t-form-item>

      <t-form-item
        name="ip"
        label="已绑IP"
        help="回车添加"
      >
        <t-tag-input
          :value="updateReq.ip"
          @change="onChange"
        />
      </t-form-item>

      <t-form-item
        name="expires_at"
        label="过期时间"
      >
        <t-date-picker
          v-model="updateReq.expires_at"
          enable-time-picker
          allow-input
          clearable
          format="YYYY-MM-DD hh:mm:ss"
        />
      </t-form-item>

      <t-form-item
        name="switch"
        label="启用"
      >
        <t-switch v-model="updateReq.switch" />
      </t-form-item>

      <t-form-item
        name="reason"
        label="原因"
      >
        <t-input v-model="updateReq.reason" />
      </t-form-item>

      <t-form-item label="选中的卡密">
        <t-input
          :value="JSON.stringify(updateReq.id)"
          disabled
        />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="tokensStore.hideEditDialog"
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
import { MessagePlugin, type FormProps, type TagInputProps } from 'tdesign-vue-next'
import { useTokensStore } from '@/stores/admin/tokens.ts'
import { storeToRefs } from 'pinia'
import { ValidateIsIp } from '@/utils/validates.ts'

const tokensStore = useTokensStore()
const { isEditDialog, updateReq } = storeToRefs(tokensStore)

const formRules: FormProps['rules'] = {
  count: [{ required: true, message: '次数配额不能为空' }],
  size: [{ required: true, message: '大小配额不能为空' }],
  day: [{ required: true, message: '时间配额不能为空' }],
  can_use_ip_count: [{ required: true, message: 'IP配额不能为空' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await tokensStore.updateSelection()
  tokensStore.hideEditDialog()
}

const onChange: TagInputProps['onChange'] = (val, context) => {
  if (!context.item || typeof context.item === 'number') return

  // 判断是否是 ip 地址
  if (!ValidateIsIp(context.item)) {
    MessagePlugin.error('请输入正确的 ip 地址')
    return
  }

  updateReq.value.ip = val as string[]
}
</script>

<style lang="scss" scoped></style>
