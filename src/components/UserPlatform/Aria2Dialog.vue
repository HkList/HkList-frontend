<template>
  <t-dialog
    v-model:visible="aria2ConfigDialogVisible"
    header="Aria2配置调整"
    :footer="false"
  >
    <t-form
      :data="aria2ConfigForm"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        label="主机地址"
        name="host"
        help="需要包括协议,端口,地址"
      >
        <t-input v-model="aria2ConfigForm.host" />
      </t-form-item>

      <t-form-item
        label="密钥"
        name="token"
      >
        <t-input v-model="aria2ConfigForm.token" />
      </t-form-item>

      <t-form-item
        label="保存路径"
        name="dir"
      >
        <t-input v-model="aria2ConfigForm.dir" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button
            theme="default"
            @click="aria2Store.hideAria2Config"
          >
            取消
          </t-button>
          <t-button @click="aria2Store.getAria2Version"> 测试连接 </t-button>
          <t-button type="submit"> 保存 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { useAria2Store } from '@/stores/user/aria2.ts'
import { storeToRefs } from 'pinia'
import { MessagePlugin, type FormProps } from 'tdesign-vue-next'

const aria2Store = useAria2Store()
const { aria2ConfigDialogVisible, aria2ConfigForm } = storeToRefs(aria2Store)

const formRules: FormProps['rules'] = {}

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  aria2Store.saveAria2Config()
  aria2Store.hideAria2Config()
  MessagePlugin.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
