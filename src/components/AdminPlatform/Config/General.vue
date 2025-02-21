<template>
  <t-card>
    <t-form
      :data="formData"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        name="frontend_version"
        label="前端版本"
      >
        <t-input
          v-model="generalConfig.frontend_version"
          disabled
        />
      </t-form-item>

      <t-form-item
        name="version"
        label="后端版本"
      >
        <t-input
          v-model="generalConfig.version"
          disabled
        />
      </t-form-item>

      <t-form-item
        name="new_admin_password"
        label="新管理员密码"
      >
        <t-input
          v-model="formData.new_admin_password"
          type="password"
        />
      </t-form-item>

      <t-form-item
        name="parse_password"
        label="解析密码"
      >
        <t-input
          v-model="formData.parse_password"
          type="password"
        />
      </t-form-item>

      <t-form-item
        name="show_announce"
        label="显示公告"
      >
        <t-switch v-model="formData.show_announce" />
      </t-form-item>

      <t-form-item
        name="announce"
        label="公告"
        help="支持HTML"
      >
        <t-textarea v-model="formData.announce" />
      </t-form-item>

      <t-form-item
        name="custom_script"
        label="自定义JS脚本"
        help="无需script标签"
      >
        <t-textarea v-model="formData.custom_script" />
      </t-form-item>

      <t-form-item
        name="custom_button"
        label="自定义按钮"
        help="按钮名称|点击跳转的链接 每行一个"
      >
        <t-textarea v-model="formData.custom_button" />
      </t-form-item>

      <t-form-item
        name="debug"
        label="启用调试模式"
      >
        <t-switch v-model="formData.debug" />
      </t-form-item>

      <t-form-item
        name="name"
        label="站点名称"
      >
        <t-input v-model="formData.name" />
      </t-form-item>

      <t-form-item
        name="logo"
        label="站点Logo"
        help="请填写正确的URL"
      >
        <t-input v-model="formData.logo" />
      </t-form-item>

      <t-form-item
        name="show_hero"
        label="显示站点信息"
      >
        <t-switch v-model="formData.show_hero" />
      </t-form-item>

      <t-form-item
        name="disable_check_rand"
        label="禁用接口参数校验"
      >
        <t-switch v-model="formData.disable_check_rand" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 保存 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { getConfig, updateConfig, type GetConfigRes, type UpdateConfigReq } from '@/api/admin/config/general.ts'
import { useConfigStore } from '@/stores/user/config.ts'
import PackageJson from '@/../package.json'

const configStore = useConfigStore()

const formData = ref<UpdateConfigReq>({
  new_admin_password: '',
  parse_password: '',
  show_announce: false,
  announce: '',
  custom_script: '',
  custom_button: '',
  debug: false,
  show_hero: false,
  name: '',
  logo: '',
  disable_check_rand: true,
})

const generalConfig = ref<GetConfigRes>({
  admin_password: '',
  version: '',
  frontend_version: '',
  parse_password: '',
  show_announce: false,
  announce: '',
  custom_script: '',
  custom_button: '',
  debug: false,
  show_hero: false,
  name: '',
  logo: '',
  disable_check_rand: true,
})

const formRules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入站点名称' }],
  logo: [{ required: true, message: '请输入站点Logo' }],
}

const getForm = async () => {
  const config = await getConfig()
  formData.value = { ...config.data, new_admin_password: config.data.admin_password }
  generalConfig.value = {
    ...config.data,
    frontend_version: PackageJson.version,
  }
}

onMounted(getForm)

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await updateConfig(formData.value)
  MessagePlugin.success('保存成功')
  await configStore.getConfig()
  await getForm()
}
</script>

<style lang="scss" scoped></style>
