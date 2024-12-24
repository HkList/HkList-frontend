<template>
  <t-card>
    <t-form
      :data="formData"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        name="token"
        label="卡密"
      >
        <t-input v-model="formData.token" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 查询 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>

  <t-card v-if="result.token !== ''">
    <t-descriptions
      layout="vertical"
      bordered
      colon
    >
      <t-descriptions-item label="卡密">{{ result.token }}</t-descriptions-item>
      <t-descriptions-item label="计划下载次数">{{ result.count }}</t-descriptions-item>
      <t-descriptions-item label="剩余下载次数">{{ result.remaining_count }}</t-descriptions-item>
      <t-descriptions-item label="计划下载大小">{{ formatBytes(result.size) }}</t-descriptions-item>
      <t-descriptions-item label="剩余下载大小">{{ formatBytes(result.remaining_size) }}</t-descriptions-item>
      <t-descriptions-item label="IP">
        <t-tag
          size="large"
          v-if="result.ip.length === 0"
        >
          没有绑定的IP
        </t-tag>
        <t-list
          stripe
          split
          size="large"
          v-else
        >
          <t-list-item
            v-for="(ip, index) in result.ip"
            :key="ip"
          >
            <t-space direction="vertical">
              <t-space>
                <t-tag size="large"> 第 {{ index + 1 }} 条 </t-tag>
                <t-button @click="copy(ip)">复制</t-button>
              </t-space>
              <p>
                {{ ip }}
              </p>
            </t-space>
          </t-list-item>
        </t-list>
      </t-descriptions-item>
      <t-descriptions-item label="使用日期">{{ result.used_at ?? '未使用' }}</t-descriptions-item>
      <t-descriptions-item label="过期日期">{{ result.expires_at ?? '未使用' }}</t-descriptions-item>
    </t-descriptions>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { type GetTokenReq, type GetTokenRes, getToken } from '@/api/user/token.ts'
import { copy } from '@/utils/copy.ts'
import { formatBytes } from '@/utils/format.ts'

const formData = ref<GetTokenReq>({
  token: localStorage.getItem('token') ?? '',
})

const result = ref<GetTokenRes>({
  token: '',
  count: 0,
  size: 0,
  remaining_count: 0,
  remaining_size: 0,
  ip: [],
  used_at: '',
  expires_at: '',
})

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  if (formData.value.token === '') formData.value.token = 'guest'

  const res = await getToken(formData.value)
  result.value = res.data
  localStorage.setItem('token', formData.value.token)

  MessagePlugin.success('查询成功')
}

onMounted(() => {
  submitForm({ validateResult: true })
})
</script>

<style lang="scss" scoped></style>
