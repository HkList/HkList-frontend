<template>
  <t-card>
    <t-form
      :data="formData"
      :rules="formRules"
      @submit="submitForm"
      :labelWidth="230"
    >
      <t-form-item
        name="max_once"
        label="单次最大能解析多少文件"
      >
        <t-input-number
          :min="0"
          v-model="formData.max_once"
          auto-width
        />
      </t-form-item>

      <t-form-item
        name="min_single_filesize"
        label="单次最小能解析的文件大小 (GB)"
      >
        <t-input-number
          :min="0"
          v-model="formData.min_single_filesize"
          auto-width
        />
      </t-form-item>

      <t-form-item
        name="max_single_filesize"
        label="单次最大能解析的文件大小 (GB)"
      >
        <t-input-number
          :min="0"
          v-model="formData.max_single_filesize"
          auto-width
        />
      </t-form-item>

      <t-form-item
        name="max_download_daily_pre_account"
        label="单个账号每日最大解析量 (GB)"
        help="不是用户,是后台设置的解析账号"
      >
        <t-input-number
          :min="0"
          v-model="formData.max_download_daily_pre_account"
          auto-width
        />
      </t-form-item>

      <t-form-item
        name="limit_cn"
        label="仅限中国用户使用"
      >
        <t-switch v-model="formData.limit_cn" />
      </t-form-item>

      <t-form-item
        name="limit_prov"
        label="对解析账号做市级分组"
      >
        <t-switch v-model="formData.limit_prov" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 提交 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { getConfig, updateConfig, type UpdateConfigReq } from '@/api/admin/config/limit.ts'
import { GB } from '@/utils/format.ts'

const formData = ref<UpdateConfigReq>({
  max_once: 0,
  min_single_filesize: 0,
  max_single_filesize: 0,
  max_download_daily_pre_account: 0,
  limit_cn: false,
  limit_prov: false,
})

const formRules: FormProps['rules'] = {
  max_once: [{ required: true, message: '请输入单次最大能解析多少文件' }],
  min_single_filesize: [{ required: true, message: '请输入单次最小能解析的文件大小' }],
  max_single_filesize: [{ required: true, message: '请输入单次最大能解析的文件大小' }],
  max_download_daily_pre_account: [{ required: true, message: '请输入单个账号每日最大解析量' }],
}

const getForm = async () => {
  const config = await getConfig()
  config.data.min_single_filesize = config.data.min_single_filesize / GB
  config.data.max_single_filesize = config.data.max_single_filesize / GB
  config.data.max_download_daily_pre_account = config.data.max_download_daily_pre_account / GB
  formData.value = config.data
}

onMounted(getForm)

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  await updateConfig({
    ...formData.value,
    min_single_filesize: formData.value.min_single_filesize * GB,
    max_single_filesize: formData.value.max_single_filesize * GB,
    max_download_daily_pre_account: formData.value.max_download_daily_pre_account * GB,
  })
  MessagePlugin.success('保存成功')
  await getForm()
}
</script>

<style lang="scss" scoped></style>
