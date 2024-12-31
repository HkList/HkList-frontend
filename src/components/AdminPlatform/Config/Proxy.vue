<template>
  <t-card>
    <t-form
      :data="formData"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="130"
    >
      <t-form-item
        name="enable"
        label="启用代理"
      >
        <t-switch v-model="formData.enable" />
      </t-form-item>

      <t-form-item
        name="http"
        label="HTTP代理"
      >
        <t-input v-model="formData.http" />
      </t-form-item>

      <t-form-item
        name="https"
        label="HTTPS代理"
      >
        <t-input v-model="formData.https" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
          <t-button @click="handleTestProxy"> 测试代理 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { getConfig, testProxy, updateConfig, type UpdateConfigReq } from '@/api/admin/config/proxy.ts'

const formData = ref<UpdateConfigReq>({
  enable: false,
  http: '',
  https: '',
})

const formRules: FormProps['rules'] = {}

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

const handleTestProxy = async () => {
  const res = await testProxy()
  const data = res.data
  if (data.data && data.success) {
    MessagePlugin.success('测试成功')
    ;[
      `当前IP: ${data.data.ip}`,
      `当前地区: ${data.data.actionAddress[0]}`,
      `运营商: ${data.data.isp}`,
      `网络类型: ${data.data.netWorkType}`,
      `是否为代理: ${data.data.proxy ? '代理' : '非代理'}`,
      `是否为VPN: ${data.data.vpn ? 'VPN' : '非VPN'}`,
      `是否为蜘蛛: ${data.data.spider ? '蜘蛛' : '非蜘蛛'}`,
      `是否为洋葱: ${data.data.tor ? '洋葱' : '非洋葱'}`,
    ].forEach((string) => MessagePlugin.success(string, 5000))
  } else {
    MessagePlugin.success(`测试失败：${data.message}`)
  }
}
</script>

<style lang="scss" scoped></style>
