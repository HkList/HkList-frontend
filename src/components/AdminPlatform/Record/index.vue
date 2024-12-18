<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="recordsStore.getRecords"
        >
          <t-option
            label="按 id 排序"
            value="id"
          />
          <t-option
            label="按 ip 排序"
            value="ip"
          />
          <t-option
            label="按 fingerprint 排序"
            value="fingerprint"
          />
          <t-option
            label="按 fs_id 排序"
            value="fs_id"
          />
          <t-option
            label="按 urls 排序"
            value="urls"
          />
          <t-option
            label="按 ua 排序"
            value="ua"
          />
          <t-option
            label="按 token_id 排序"
            value="token_id"
          />
          <t-option
            label="按 account_id 排序"
            value="account_id"
          />
          <t-option
            label="按 created_at 排序"
            value="created_at"
          />
          <t-option
            label="按 updated_at 排序"
            value="updated_at"
          />
        </t-select>
        <t-select
          v-model="selectReq.direction"
          @change="recordsStore.getRecords"
        >
          <t-option
            label="正序"
            value="asc"
          />
          <t-option
            label="倒序"
            value="desc"
          />
        </t-select>
        <t-button @click="recordsStore.getRecords"> 刷新列表 </t-button>
      </t-space>
    </div>
    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="recordList"
      :pagination="pagination"
      :columns="columns"
    >
      <template #expandedRow="{ row }">
        <t-descriptions
          bordered
          colon
          layout="vertical"
        >
          <t-descriptions-item label="Surl">
            {{ row.file.surl }}
          </t-descriptions-item>
          <t-descriptions-item label="Pwd">
            {{ row.file.pwd }}
          </t-descriptions-item>
          <t-descriptions-item label="Ua">
            {{ row.ua }}
          </t-descriptions-item>
          <t-descriptions-item label="Urls">
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
          </t-descriptions-item>
        </t-descriptions>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="tsx" setup>
import { useRecordsStore } from '@/stores/records.ts'
import { storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import { formatBytes } from '@/utils/format.ts'
import { copy } from '@/utils/copy.ts'

const recordsStore = useRecordsStore()
const { recordList, pagination, selectReq } = storeToRefs(recordsStore)

onMounted(recordsStore.getRecords)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
  },
  {
    colKey: 'ip',
    title: 'IP',
    ellipsis: true,
  },
  {
    colKey: 'fingerprint',
    title: '指纹',
    ellipsis: true,
  },
  {
    colKey: 'file.size',
    title: '文件大小',
    cell: (h, { row }) => <>{formatBytes(row.file.size)}</>,
    ellipsis: true,
  },
  {
    colKey: 'token.token',
    title: '卡密',
    ellipsis: true,
  },
  {
    colKey: 'account.baidu_name',
    title: '解析账号名称',
    ellipsis: true,
  },
  {
    colKey: 'created_at',
    title: '创建时间',
    width: 175,
    ellipsis: true,
  },
  {
    colKey: 'updated_at',
    title: '更新时间',
    width: 175,
    ellipsis: true,
  },
])
</script>

<style lang="scss" scoped></style>
