<template>
  <t-card>
    <t-form
      :data="selectReq"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        name="token"
        label="卡密"
      >
        <t-input v-model="selectReq.token" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 查询 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>

  <t-card>
    <t-space
      direction="vertical"
      class="space"
    >
      <t-alert>
        下载请推荐使用Aria2下载器,如
        <t-link
          href="https://motrix.app/"
          target="_blank"
        >
          <template #prefix-icon>
            <LinkIcon />
          </template>
          Motrix
        </t-link>
        <p>IDM下载需要手动指定UA,点击即可复制</p>
        <p>如果当前链接下载失败,请尝试更换链接,如果全部不可用可重新解析该文件</p>
        <br />
        <t-space>
          <t-button @click="aria2Store.showAria2Config"> 修改Aria2配置 </t-button>
          <t-button @click="aria2Store.downloadLinks(selectedRows)">批量发送</t-button>
        </t-space>
      </t-alert>

      <t-table
        row-key="id"
        resizable
        lazy-load
        :bordered="true"
        :data="historyList"
        :pagination="pagination"
        :columns="columns"
        :select-on-row-click="true"
        :selectedRowKeys="selectedRowKeys"
        @select-change="historyStore.handleSelectChange"
      >
        <template #expandedRow="{ row }">
          <t-list
            split
            size="large"
          >
            <t-list-item
              v-for="(url, index) in row.urls"
              :key="url"
            >
              <t-space direction="vertical">
                <t-space>
                  <t-tag size="large"> 第 {{ index + 1 }} 条 </t-tag>
                  <t-button @click="copy(url)">复制</t-button>
                  <t-button @click="aria2Store.addAria2Url(url, row.filename, row.ua, 16)">发送到Aria2下载器</t-button>
                </t-space>
                <p>
                  {{ url }}
                </p>
              </t-space>
            </t-list-item>
          </t-list>
        </template>
      </t-table>
    </t-space>
  </t-card>

  <Aria2Dialog />
</template>

<script lang="tsx" setup>
import { type FormProps, MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { LinkIcon } from 'tdesign-icons-vue-next'
import { copy } from '@/utils/copy.ts'
import { onMounted, ref } from 'vue'
import { formatBytes } from '@/utils/format.ts'
import { useAria2Store } from '@/stores/user/aria2.ts'
import Aria2Dialog from '@/components/UserPlatform/Aria2Dialog.vue'
import { useHistoryStore } from '@/stores/user/history.ts'
import { storeToRefs } from 'pinia'

const aria2Store = useAria2Store()

const historyStore = useHistoryStore()
const { selectReq, pagination, historyList, selectedRowKeys, selectedRows } = storeToRefs(historyStore)

const formRules: FormProps['rules'] = {
  token: [{ required: true, message: '请输入卡密' }],
}

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left',
  },
  {
    colKey: 'file.filename',
    title: '文件名',
    ellipsis: true,
  },
  {
    colKey: 'ua',
    title: '下载UA',
    cell: (h, { row }) => (
      <t-link onClick={() => copy(row.ua)}>
        <LinkIcon />
        {row.ua}
      </t-link>
    ),
    ellipsis: true,
  },
  {
    colKey: 'created_at',
    title: '解析时间',
    ellipsis: true,
  },
  {
    colKey: 'size',
    title: '文件大小',
    cell: (h, { row }) => <>{formatBytes(row.file.size)}</>,
    ellipsis: true,
  },
])

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await historyStore.getHistory()
  localStorage.setItem('token', selectReq.value.token)
  MessagePlugin.success('查询成功')
}

onMounted(() => {
  selectReq.value.token = localStorage.getItem('token') ?? 'guest'
  submitForm({ validateResult: true })
})
</script>

<style lang="scss" scoped>
:deep(.space) {
  width: 100%;
}
</style>
