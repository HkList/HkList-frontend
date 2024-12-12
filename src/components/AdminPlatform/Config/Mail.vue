<template>
  <t-card>
    <t-form :data="formData" :rules="formRules" @submit="submitForm" :labelWidth="150">
      <t-form-item name="mail_switch" label="启用邮件服务">
        <t-switch v-model="formData.mail_switch" />
      </t-form-item>

      <t-form-item name="mail_host" label="SMTP服务器地址">
        <t-input v-model="formData.mail_host" />
      </t-form-item>

      <t-form-item name="mail_port" label="SMTP服务器端口">
        <t-input-number v-model="formData.mail_port" :min="0" />
      </t-form-item>

      <t-form-item name="mail_username" label="SMTP用户名">
        <t-input v-model="formData.mail_username" />
      </t-form-item>

      <t-form-item name="mail_password" label="SMTP密码">
        <t-input v-model="formData.mail_password" />
      </t-form-item>

      <t-form-item name="mail_from_address" label="发件人邮箱地址">
        <t-input v-model="formData.mail_from_address" />
      </t-form-item>

      <t-form-item name="mail_from_name" label="发件人名称">
        <t-input v-model="formData.mail_from_name" />
      </t-form-item>

      <t-form-item name="mail_to_address" label="收件人邮箱地址">
        <t-input v-model="formData.mail_to_address" />
      </t-form-item>

      <t-form-item name="mail_to_name" label="收件人名称">
        <t-input v-model="formData.mail_to_name" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button theme="primary" type="submit">提交</t-button>
          <t-button theme="primary" @click="handleSendTestMail">发送测试邮件</t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import {
  getConfig,
  sendTestMail,
  updateConfig,
  type UpdateConfigReq,
} from '@/api/admin/config/mail.ts'

const formData: FormProps['data'] = ref<UpdateConfigReq>({
  mail_switch: false,
  mail_host: '',
  mail_port: 0,
  mail_username: '',
  mail_password: '',
  mail_from_address: '',
  mail_from_name: '',
  mail_to_address: '',
  mail_to_name: '',
})

const formRules: FormProps['rules'] = {
  mail_host: [{ required: true, message: '请输入SMTP服务器地址' }],
  mail_port: [{ required: true, message: '请输入SMTP服务器端口' }],
  mail_username: [{ required: true, message: '请输入SMTP用户名' }],
  mail_password: [{ required: true, message: '请输入SMTP密码' }],
  mail_from_address: [{ required: true, message: '请输入发件人邮箱地址' }],
  mail_from_name: [{ required: true, message: '请输入发件人名称' }],
  mail_to_address: [{ required: true, message: '请输入收件人邮箱地址' }],
  mail_to_name: [{ required: true, message: '请输入收件人名称' }],
}

const getForm = async () => {
  const config = await getConfig()
  formData.value = config.data
}

onMounted(getForm)

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await updateConfig(formData.value)
  MessagePlugin.success('保存成功')
  await getForm()
}

const handleSendTestMail = async () => {
  await sendTestMail()
  MessagePlugin.success('发送成功')
}
</script>

<style lang="scss" scoped></style>
