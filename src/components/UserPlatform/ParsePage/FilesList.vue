<template>
  <t-card v-if="GetFileListRes">
    <t-table
      row-key="fs_id"
      resizable
      lazy-load
      :bordered="true"
      :data="GetFileListRes.list"
      :maxHeight="500"
      :columns="columns"
      :select-on-row-click="true"
      :selectedRowKeys="selectedRowKeys"
      @select-change="fileListSotre.handleSelectChange"
    />
  </t-card>
</template>

<script lang="tsx" setup>
import { storeToRefs } from 'pinia'
import { useFileListStore } from '@/stores/user/fileList.ts'
import { ref } from 'vue'
import type { TableProps } from 'tdesign-vue-next'
import { formatBytes, formatTimestamp } from '@/utils/format.ts'
import type { File } from '@/api/user/parse.ts'
import { getFileIcon, iconList } from '@/utils/genFileIcon.ts'

const fileListSotre = useFileListStore()
const { GetFileListReq, GetFileListRes, selectedRowKeys } = storeToRefs(fileListSotre)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left',
  },
  {
    colKey: 'server_filename',
    title: '文件名',
    cell: (h, { row }) => (
      <>
        <div class='filename'>
          <div
            class='ico'
            style={{
              backgroundImage: `url(${row.is_dir ? iconList['folder'] : getFileIcon(row.server_filename)})`,
            }}
          />
          <span>{row.server_filename}</span>
        </div>
      </>
    ),
    ellipsis: true,
  },
  {
    colKey: 'server_mtime',
    title: '修改时间',
    cell: (h, { row }) => <>{formatTimestamp(row.server_mtime)}</>,
    ellipsis: true,
  },
  {
    colKey: 'size',
    title: '文件大小',
    cell: (h, { row }) => <>{formatBytes(row.size)}</>,
    ellipsis: true,
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) =>
      row.is_dir ? (
        <>
          <t-button
            theme='primary'
            onClick={(event: PointerEvent) => getDir(event, row.path)}
          >
            打开文件夹
          </t-button>
        </>
      ) : (
        <>
          <t-button
            theme='primary'
            onClick={(event: PointerEvent) => fileListSotre.getDownloadLinks(event, row as File)}
          >
            解析
          </t-button>
        </>
      ),
    width: 130,
    align: 'center',
    fixed: 'right',
  },
])

const getDir = async (event: PointerEvent, path: string) => {
  event.stopPropagation()

  GetFileListReq.value.dir = path
  await fileListSotre.getFileList()
}
</script>

<style lang="scss" scoped></style>
