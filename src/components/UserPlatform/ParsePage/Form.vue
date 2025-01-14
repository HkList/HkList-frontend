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
        :labelWidth="120"
        @submit="submitForm"
      >
        <t-form-item
          name="url"
          label="链接"
        >
          <t-input
            v-model.trim="GetFileListReq.url"
            @blur="parseUrl"
            @change="clearDir"
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
          <t-input
            v-model.trim="GetFileListReq.pwd"
            @change="clearDir"
          />
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

        <t-form-item
          name="dir"
          label="路径"
        >
          <t-input
            v-model.trim="GetFileListReq.dir"
            disabled
          />
        </t-form-item>

        <template v-if="vcode.hit_captcha">
          <t-form-item
            label="验证码图片"
            name="vcode_img"
          >
            <img
              :src="`${vcode.vcode_img}&t=${timestamp}`"
              @click="changeTimestamp"
            />
          </t-form-item>
          <t-form-item
            label="验证码字符"
            name="vcode_input"
          >
            <t-input v-model="vcode.vcode_input" />
          </t-form-item>
        </template>

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
import { onMounted, ref } from 'vue'
import { formatBytes } from '@/utils/format.ts'
import { getUrlId } from '@/utils/getUrlId.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const fileListSotre = useFileListStore()
const { GetFileListReq, GetLimitReq, GetLimitRes, GetLimitError, GetFileListRes, GetDownLoadLinksRes, vcode } = storeToRefs(fileListSotre)

const parseUrl = () => {
  const res = getUrlId(GetFileListReq.value.url)
  if (!res) return

  const { surl, pwd, url } = res
  GetFileListReq.value.surl = surl
  GetFileListReq.value.url = url
  GetFileListReq.value.dir = '/'
  if (pwd) {
    GetFileListReq.value.pwd = pwd
    MessagePlugin.success('已自动填写密码~')
  }
}

const clearDir = () => {
  GetFileListReq.value.dir = '/'
  GetFileListRes.value = undefined
  GetDownLoadLinksRes.value = []
}

const formRules: FormProps['rules'] = {
  url: [{ required: true, message: '链接不能为空' }],
  parse_password: [{ required: true, message: '解析密码不能为空' }],
  vcode_input: [{ required: true, message: '验证码不能为空' }],
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

const timestamp = ref(Date.now())

const changeTimestamp = () => {
  timestamp.value = Date.now()
}
</script>

<style lang="scss" scoped>
.space {
  width: 100%;
}

img:hover {
  cursor: pointer;
}
</style>
