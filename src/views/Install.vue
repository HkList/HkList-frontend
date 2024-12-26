<template>
  <t-layout>
    <t-card class="login">
      <h1>
        <img
          src="/favicon.ico"
          alt="logo"
        />
      </h1>
      <h2>安装 | HkList</h2>
      <t-form
        :data="formData"
        :rules="formRules"
        @submit="submitForm"
      >
        <t-form-item
          name="app_name"
          label="网站名称"
        >
          <t-input v-model="formData.app_name" />
        </t-form-item>

        <t-form-item
          name="db_host"
          label="Mysql地址"
        >
          <t-input v-model="formData.db_host" />
        </t-form-item>

        <t-form-item
          name="db_port"
          label="Mysql端口"
        >
          <t-input-number v-model="formData.db_port" />
        </t-form-item>

        <t-form-item
          name="db_database"
          label="Mysql数据库"
        >
          <t-input v-model="formData.db_database" />
        </t-form-item>

        <t-form-item
          name="db_username"
          label="Mysql用户名"
        >
          <t-input v-model="formData.db_username" />
        </t-form-item>

        <t-form-item
          name="db_password"
          label="Mysql密码"
        >
          <t-input v-model="formData.db_password" />
        </t-form-item>

        <t-form-item>
          <t-space size="small">
            <t-button type="submit"> 提交 </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </t-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'
import { install, type InstallReq } from '@/api/install.ts'
import { useConfigStore } from '@/stores/user/config.ts'

const router = useRouter()

const formData = ref<InstallReq>({
  app_name: '',
  db_host: '',
  db_port: 3306,
  db_database: '',
  db_username: '',
  db_password: '',
})

const formRules: FormProps['rules'] = {
  app_name: [{ required: true, message: '请输入网站名称' }],
  db_host: [{ required: true, message: '请输入Mysql地址' }],
  db_port: [{ required: true, message: '请输入Mysql端口' }],
  db_database: [{ required: true, message: '请输入Mysql数据库' }],
  db_username: [{ required: true, message: '请输入Mysql用户名' }],
}

const configStore = useConfigStore()

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await install(formData.value)
  MessagePlugin.success('安装成功')
  await configStore.getConfig()
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
