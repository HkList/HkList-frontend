<template>
  <t-card>
    <t-form
      :data="formData"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="150"
    >
      <t-form-item
        name="parser_server"
        label="授权服务器"
      >
        <t-input v-model="formData.parser_server" />
      </t-form-item>

      <t-form-item
        name="parser_password"
        label="授权密钥"
      >
        <t-input v-model="formData.parser_password" />
      </t-form-item>

      <t-form-item
        name="parse_mode"
        label="解析模式"
      >
        <t-select
          v-model="formData.parse_mode"
          @change="matchUserAgent"
          @blur="matchUserAgent"
        >
          <t-option
            label="V0免费-SVIP-盘内"
            :value="0"
          />
          <t-option
            label="V1-SVIP-盘内"
            :value="1"
          />
          <t-option
            label="V2-SVIP-盘外"
            :value="2"
          />
          <t-option
            label="V3开放平台-SVIP-盘内"
            :value="3"
          />
          <t-option
            label="V4开放平台-SVIP-盘内"
            :value="4"
          />
          <t-option
            label="V5企业-企业套餐-盘内"
            :value="5"
          />
          <t-option
            label="V6企业-下载卷-盘内"
            :value="6"
          />
          <t-option
            label="V7企业-企业套餐-盘外"
            :value="7"
          />
        </t-select>
      </t-form-item>

      <t-form-item
        name="user_agent"
        label="下载UA"
      >
        <t-input v-model="formData.user_agent" />
      </t-form-item>

      <!-- <t-form-item
        name="use_exploit"
        label="启用漏洞模式"
        help="小于100M的文件使用漏洞模式, 需要准备无会员的CK账号, 不支持V0"
      >
        <t-switch v-model="formData.use_exploit" />
      </t-form-item> -->

      <t-form-item
        name="allow_folder"
        label="允许解析文件夹"
      >
        <t-switch v-model="formData.allow_folder" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
          <t-button @click="handleTestAuth"> 测试授权 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { getConfig, testAuth, updateConfig, type UpdateConfigReq } from '@/api/admin/config/parse.ts'

const formData = ref<UpdateConfigReq>({
  parser_server: '',
  parser_password: '',
  parse_mode: 1,
  user_agent: '',
  use_exploit: false,
  allow_folder: false,
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
    case 0:
      formData.value.user_agent = 'netdisk;7.42.0.5;PC'
      break
    case 3:
      formData.value.user_agent = 'pan.baidu.com'
      break
    case 4:
      formData.value.user_agent = 'Mozilla/5.0 (hklist-laravel;netdisk;svip)'
      break
    case 1:
    case 2:
    case 5:
    case 6:
    case 7:
      formData.value.user_agent = 'netdisk;P2SP;3.0.20.88'
      break
    default:
      MessagePlugin.error('未知解析模式')
      break
  }
}

const handleTestAuth = async () => {
  const res = await testAuth()
  MessagePlugin.success(`测试通过,有效期至: ${res.data.expires_at}`)
}
</script>

<style lang="scss" scoped></style>
