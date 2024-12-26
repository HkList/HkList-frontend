<template>
  <t-card>
    <t-space
      direction="vertical"
      class="space"
    >
      <t-alert :theme="config.have_account ? 'success' : 'error'">
        {{ config.have_account ? '当前中转账号充足' : '当前中转账号不足' }}
      </t-alert>

      <t-alert
        theme="error"
        v-if="config.debug"
      >
        当前网站开启了DEBUG模式,非调试请关闭!!!!
      </t-alert>

      <t-alert :theme="GetLimitError.length === 0 ? 'success' : 'error'">
        <t-space v-if="GetLimitError.length === 0">
          <span>剩余可解析文件数: {{ GetLimitRes.count }}</span>
          <span>剩余可解析大小: {{ formatBytes(GetLimitRes.size) }}</span>
          <span>到期时间: {{ GetLimitRes.expires_at }}</span>
        </t-space>
        <span v-else>
          {{ GetLimitError }}
        </span>
      </t-alert>

      <t-form
        :data="GetFileListReq"
        :rules="formRules"
        @submit="submitForm"
      >
        <t-form-item
          name="url"
          label="链接"
        >
          <t-input
            v-model.trim="GetFileListReq.url"
            @blur="parseUrl"
          />
        </t-form-item>

        <t-form-item
          name="surl"
          label="提取到的链接"
        >
          <t-input
            :value="GetFileListReq.surl"
            disabled
          />
        </t-form-item>

        <t-form-item
          name="pwd"
          label="提取码"
        >
          <t-input v-model.trim="GetFileListReq.pwd" />
        </t-form-item>

        <t-form-item
          name="parse_password"
          label="解析密码"
          v-if="config.need_password"
        >
          <t-input v-model.trim="GetFileListReq.parse_password" />
        </t-form-item>

        <t-form-item
          name="token"
          label="卡密"
        >
          <t-input
            v-model.trim="GetLimitReq.token"
            @blur="fileListSotre.getLimit"
          />
        </t-form-item>

        <t-form-item>
          <t-space size="small">
            <t-button type="submit"> 获取文件列表 </t-button>
            <t-button @click="fileListSotre.getDownloadLinks"> 批量解析 </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-space>
  </t-card>
</template>

<script lang="tsx" setup>
import { type FormProps, MessagePlugin } from 'tdesign-vue-next'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/user/config.ts'
import { useFileListStore } from '@/stores/user/fileList.ts'
import { onMounted } from 'vue'
import { formatBytes } from '@/utils/format.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const fileListSotre = useFileListStore()
const { GetFileListReq, GetLimitReq, GetLimitRes, GetLimitError } = storeToRefs(fileListSotre)

const parseUrl = () => {
  const url = GetFileListReq.value.url
  const fullMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
  const fullMatch2 = url.match(/surl=([a-zA-Z0-9_-]+)/)
  const pwdMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch2 = url.match(/&pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch3 = url.match(/提取码[:：]\s?([a-zA-Z0-9_-]+)/)

  if (fullMatch) {
    GetFileListReq.value.surl = fullMatch[1]
  } else if (fullMatch2) {
    GetFileListReq.value.surl = `1${fullMatch2[1]}`
  } else {
    GetFileListReq.value.surl = ''
    GetFileListReq.value.pwd = ''
    GetFileListReq.value.dir = ''
    return MessagePlugin.error('无法识别的链接')
  }

  GetFileListReq.value.url = `https://pan.baidu.com/s/${GetFileListReq.value.surl}`
  GetFileListReq.value.pwd = pwdMatch ? pwdMatch[1] : pwdMatch2 ? pwdMatch2[1] : pwdMatch3 ? pwdMatch3[1] : ''

  MessagePlugin.success('链接识别成功~')

  return true
}

const formRules: FormProps['rules'] = {
  url: [{ required: true, message: '链接不能为空' }],
  parse_password: [{ required: true, message: '解析密码不能为空' }],
}

onMounted(() => {
  fileListSotre.getLimit()
  configStore.getConfig()
})

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  GetFileListReq.value.dir = '/'
  await fileListSotre.getFileList()
  MessagePlugin.success('获取成功')
}
</script>

<style lang="scss" scoped>
.space {
  width: 100%;
}
</style>
