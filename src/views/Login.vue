<template>
  <t-layout>
    <t-card class="login">
      <h1>
        <img
          :src="config.logo"
          alt="logo"
        />
      </h1>
      <h2>登陆 | {{ config.name }}</h2>
      <t-form
        :data="formData"
        :rules="formRules"
        @submit="submitForm"
      >
        <t-form-item
          name="admin_password"
          label="管理员密码"
        >
          <t-input v-model="formData.admin_password" />
        </t-form-item>
        <t-form-item>
          <t-space size="small">
            <t-button
              theme="primary"
              type="submit"
            >
              提交
            </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { checkPassword, type CheckPasswordReq } from '@/api/admin/check_password.ts'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const router = useRouter()

const formData = ref<CheckPasswordReq>({
  admin_password: '',
})

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await checkPassword({ admin_password: formData.value.admin_password })
  localStorage.setItem('admin_password', formData.value.admin_password)
  MessagePlugin.success('登陆成功')
  router.push('/admin')
}
</script>

<style lang="scss" scoped>
.login {
  width: 500px;
  margin: 80px auto;
  padding: 20px;
}

h1,
h2 {
  text-align: center;
}

h2 {
  margin: 40px;
}
</style>
