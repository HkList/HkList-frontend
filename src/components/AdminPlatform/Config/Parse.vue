<template>
  <t-card>
    <t-form :data="formData" :rules="formRules" @submit="submitForm" :labelWidth="130">
      <t-form-item name="parser_server" label="授权服务器">
        <t-input v-model="formData.parser_server" />
      </t-form-item>

      <t-form-item name="parser_password" label="授权密钥">
        <t-input v-model="formData.parser_password" />
      </t-form-item>

      <t-form-item name="parse_mode" label="解析模式">
        <t-select v-model="formData.parse_mode" @change="matchUserAgent" @blur="matchUserAgent">
          <t-option label="V1盘内" :value="1" />
          <t-option label="V2盘外" :value="2" />
          <t-option label="V3开放平台" :value="3" />
          <t-option label="V4开放平台" :value="4" />
          <t-option label="V5企业模式" :value="5" />
          <t-option label="V6下载卷" :value="6" />
        </t-select>
      </t-form-item>

      <t-form-item name="user_agent" label="下载UA">
        <t-input v-model="formData.user_agent" />
      </t-form-item>

      <t-form-item name="proxy_server" label="代理服务器地址">
        <t-input v-model="formData.proxy_server" />
      </t-form-item>

      <t-form-item name="proxy_password" label="代理服务器密码">
        <t-input v-model="formData.proxy_password" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button theme="primary" type="submit">提交</t-button>
          <t-button theme="primary" @click="handleTestAuth">测试授权</t-button>
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
  testAuth,
  updateConfig,
  type UpdateConfigReq,
} from '@/api/admin/config/parse.ts'

const formData: FormProps['data'] = ref<UpdateConfigReq>({
  parser_server: '',
  parser_password: '',
  parse_mode: 1,
  user_agent: '',
  proxy_server: '',
  proxy_password: '',
})

const formRules: FormProps['rules'] = {
  user_agent: [{ required: true, message: '请输入下载UA' }],
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

const matchUserAgent = () => {
  switch (formData.value.parse_mode) {
    case 1:
    case 2:
    case 6:
      formData.value.user_agent =
        'netdisk;P2SP;3.0.20.63;netdisk;4.36.2;PC;PC-Windows;10.0.19045;UniBaiduYunGuanJia'
      break
    case 3:
      formData.value.user_agent = 'pan.baidu.com'
      break
    case 4:
      formData.value.user_agent = 'Mozilla/5.0 (94list-laravel;netdisk;svip)'
      break
    case 5:
      formData.value.user_agent = 'netdisk;hklist'
      break
    default:
      formData.value.user_agent =
        'netdisk;P2SP;3.0.20.63;netdisk;4.36.2;PC;PC-Windows;10.0.19045;UniBaiduYunGuanJia'
      break
  }
}

const handleTestAuth = async () => {
  const res = await testAuth()
  if (res.data.valid) {
    MessagePlugin.success(`测试通过,有效期至: ${res.data.expires_at}`)
  } else {
    MessagePlugin.error(`测试失败,请检查授权服务器和授权密钥`)
  }
}
</script>

<style lang="scss" scoped></style>
