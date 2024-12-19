<template>
  <t-card v-if="GetDownLoadLinksRes.length > 0">
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
              </t-space>
              <p>
                {{ url }}
              </p>
            </t-space>
          </t-list-item>
        </t-list>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="tsx" setup>
import { storeToRefs } from 'pinia'
import { useFileListStore } from '@/stores/fileList.ts'
import type { TableProps } from 'tdesign-vue-next'
import { ref } from 'vue'
import { copy } from '@/utils/copy.ts'

const fileListSotre = useFileListStore()
const { GetDownLoadLinksRes } = storeToRefs(fileListSotre)

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
    cell: (h, { row }) => <t-link onClick={() => copy(row.ua)}>{row.ua}</t-link>,
  },
  {
    colKey: 'fs_id',
    title: '文件ID',
  },
])
</script>

<style lang="scss" scoped></style>
