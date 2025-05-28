<template>
  <t-dialog
    v-model:visible="isAddingToken"
    header="添加卡密"
    :footer="false"
  >
    <t-form
      @submit="submitForm"
      :data="addTokenReq"
      :rules="formRules"
    >
      <t-form-item
        name="token_type"
        label="卡密类型"
      >
        <t-select v-model="addTokenReq.token_type">
          <t-option
            label="普通模式"
            value="normal"
          />
          <t-option
            label="每日刷新模式"
            value="daily"
          />
        </t-select>
      </t-form-item>

      <t-form-item
        name="type"
        label="添加方式"
      >
        <t-select v-model="addTokenReq.type">
          <t-option
            label="手动添加"
            value="set"
          />
          <t-option
            label="自动添加"
            value="generate"
          />
        </t-select>
      </t-form-item>

      <template v-if="addTokenReq.type === 'set'">
        <t-form-item
          name="token"
          label="卡密"
        >
          <t-input v-model="addTokenReq.token" />
        </t-form-item>
      </template>
      <template v-else>
        <t-form-item
          name="generate_count"
          label="生成数量"
        >
          <t-input-number
            :min="1"
            v-model="addTokenReq.generate_count"
          />
        </t-form-item>
      </template>

      <t-form-item
        name="count"
        label="次数配额"
      >
        <t-input-number
          :min="1"
          v-model="addTokenReq.count"
        />
      </t-form-item>

      <t-form-item
        name="size"
        label="大小配额(GB)"
      >
        <t-input-number
          :min="1"
          v-model="addTokenReq.size"
        />
      </t-form-item>

      <t-form-item
        name="day"
        label="时间配额"
      >
        <t-input-number
          :min="1"
          v-model="addTokenReq.day"
        />
      </t-form-item>

      <t-form-item
        name="can_use_ip_count"
        label="IP配额"
      >
        <t-input-number
          :min="1"
          v-model="addTokenReq.can_use_ip_count"
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
const { isAddingToken, addTokenReq } = storeToRefs(tokensStore)

const formRules: FormProps['rules'] = {
  token: [{ required: true, message: '卡密不能为空' }],
  generate_count: [{ required: true, message: '生成数量不能为空' }],
  count: [{ required: true, message: '次数配额不能为空' }],
  size: [{ required: true, message: '大小配额不能为空' }],
  day: [{ required: true, message: '时间配额不能为空' }],
  can_use_ip_count: [{ required: true, message: 'IP配额不能为空' }],
}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await tokensStore.addToken()
  tokensStore.hideAddingTokenDialog()
}
</script>

<style lang="scss" scoped></style>
