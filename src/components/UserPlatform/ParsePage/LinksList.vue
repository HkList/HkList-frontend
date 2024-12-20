<template>
  <t-card v-if="GetDownLoadLinksRes.length > 0">
    <t-space direction="vertical">
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
        <t-button @click="aria2Store.showAria2Config"> 修改Aria2配置 </t-button>
      </t-alert>

      <t-table
        row-key="fs_id"
        resizable
        lazy-load
        :bordered="true"
        :data="GetDownLoadLinksRes"
        :columns="columns"
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
</template>

<script lang="tsx" setup>
import { storeToRefs } from 'pinia'
import { useFileListStore } from '@/stores/fileList.ts'
import { type TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'
import { copy } from '@/utils/copy.ts'
import { LinkIcon } from 'tdesign-icons-vue-next'
import { useAria2Store } from '@/stores/aria2.ts'
import type { GetDownLoadLinksRes } from '@/api/user/parse.ts'

const fileListSotre = useFileListStore()
const { GetDownLoadLinksRes } = storeToRefs(fileListSotre)

const aria2Store = useAria2Store()

const columns = ref<TableProps['columns']>([
  {
    colKey: 'message',
    title: '状态',
  },
  {
    colKey: 'filename',
    title: '文件名',
  },
  {
    colKey: 'ua',
    title: 'UA',
    cell: (h, { row }) => (
      <t-link onClick={() => copy(row.ua)}>
        <LinkIcon />
        {row.ua}
      </t-link>
    ),
  },
  {
    colKey: 'fs_id',
    title: '文件ID',
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row, rowIndex }) => (
      <>
        <t-button onClick={() => reGetDownloadLinks(row as GetDownLoadLinksRes[number], rowIndex)}>重新解析</t-button>
      </>
    ),
  },
])

const reGetDownloadLinks = async (row: GetDownLoadLinksRes[number], rowIndex: number) => {
  const res = await fileListSotre.getDownloadLinks(row.fs_id)
  if (res) GetDownLoadLinksRes.value[rowIndex].urls = res[0].urls
}
</script>

<style lang="scss" scoped></style>
