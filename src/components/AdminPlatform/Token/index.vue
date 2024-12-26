<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="tokensStore.getTokens"
        >
          <t-option
            label="按 id 排序"
            value="id"
          />
          <t-option
            label="按 token 排序"
            value="token"
          />
          <t-option
            label="按 count 排序"
            value="count"
          />
          <t-option
            label="按 size 排序"
            value="size"
          />
          <t-option
            label="按 day 排序"
            value="day"
          />
          <t-option
            label="按 can_use_ip_count 排序"
            value="can_use_ip_count"
          />
          <t-option
            label="按 ip 排序"
            value="ip"
          />
          <t-option
            label="按 expires_at 排序"
            value="expires_at"
          />
          <t-option
            label="按 created_at 排序"
            value="created_at"
          />
          <t-option
            label="按 updated_at 排序"
            value="updated_at"
          />
          <t-option
            label="按 deleted_at 排序"
            value="deleted_at"
          />
        </t-select>
        <t-select
          v-model="selectReq.direction"
          @change="tokensStore.getTokens"
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
        <t-button @click="tokensStore.getTokens"> 刷新列表 </t-button>
        <t-button @click="tokensStore.showAddingTokenDialog"> 添加卡密 </t-button>
        <t-button @click="tokensStore.deleteSelection"> 批量删除 </t-button>
        <t-button @click="tokensStore.showUpdateSwitchDialog"> 批量启用/禁用 </t-button>
        <t-button @click="tokensStore.showEditDialog"> 批量更新 </t-button>
        <t-button @click="tokensStore.copySelection"> 批量复制 </t-button>
        <t-button @click="tokensStore.copySelectionNoFormat"> 无格式批量复制 </t-button>
      </t-space>
    </div>
    <AddToken />
    <UpdateSwitch />
    <UpdateToken />
    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="tokenList"
      :pagination="pagination"
      :columns="columns"
      :select-on-row-click="true"
      :selectedRowKeys="selectedRowKeys"
      @select-change="tokensStore.handleSelectChange"
    >
      <template #expandedRow="{ row }">
        <t-descriptions
          bordered
          colon
          layout="vertical"
        >
          <t-descriptions-item label="已绑定的ip">
            <t-tag
              size="large"
              v-if="row.ip.length === 0"
            >
              没有绑定的IP
            </t-tag>
            <t-list
              stripe
              split
              size="large"
              v-else
            >
              <t-list-item
                v-for="(ip, index) in row.ip"
                :key="ip"
              >
                <t-space direction="vertical">
                  <t-space>
                    <t-tag size="large"> 第 {{ index + 1 }} 条 </t-tag>
                    <t-button @click="copy(ip)">复制</t-button>
                  </t-space>
                  <p>
                    {{ ip }}
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
import { useTokensStore } from '@/stores/admin/tokens.ts'
import { formatBytes, formatDateToString } from '@/utils/format.ts'
import { storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import AddToken from './AddToken.vue'
import UpdateToken from './UpdateToken.vue'
import UpdateSwitch from './UpdateSwitch.vue'
import { copy } from '@/utils/copy.ts'

const tokensStore = useTokensStore()
const { selectReq, tokenList, pagination, selectedRowKeys } = storeToRefs(tokensStore)

onMounted(tokensStore.getTokens)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    fixed: 'left',
  },
  {
    colKey: 'id',
    title: 'ID',
  },
  {
    colKey: 'token',
    title: '卡密',
    width: 200,
    ellipsis: true,
  },
  {
    colKey: 'switch',
    title: '状态',
    cell: (h, { row }) => <>{row.switch ? '启用' : `禁用 (${row.reason})`}</>,
    ellipsis: true,
  },
  {
    colKey: 'today_count',
    title: '今日解析',
    cell: (h, { row }) => (
      <>
        {row.today_count} ({formatBytes(row.today_size ?? 0)})
      </>
    ),
    width: 150,
    ellipsis: true,
  },
  {
    colKey: 'total_count',
    title: '总计解析',
    cell: (h, { row }) => (
      <>
        {row.total_count} ({formatBytes(row.total_size ?? 0)})
      </>
    ),
    width: 150,
    ellipsis: true,
  },
  {
    colKey: 'size',
    title: '大小配额',
    cell: (h, { row }) => <>{formatBytes(row.size)}</>,
    width: 90,
    ellipsis: true,
  },
  {
    colKey: 'count',
    title: '次数配额',
    cell: (h, { row }) => <>{row.count} 次</>,
    width: 90,
    ellipsis: true,
  },
  {
    colKey: 'day',
    title: '时间配额',
    cell: (h, { row }) => <>{row.day} 天</>,
    width: 90,
    ellipsis: true,
  },
  {
    colKey: 'can_use_ip_count',
    title: 'IP配额',
    cell: (h, { row }) => <>{row.can_use_ip_count} 个</>,
    ellipsis: true,
  },
  {
    colKey: 'expires_at',
    title: '过期时间',
    cell: (h, { row }) => <>{row.expires_at === null ? '未使用' : formatDateToString(row.expires_at)}</>,
    width: 175,
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
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => (
      <t-button
        theme='primary'
        onClick={(event: PointerEvent) => tokensStore.showEditDialog(event, row.id)}
      >
        编辑
      </t-button>
    ),
    width: 90,
    fixed: 'right',
  },
])
</script>

<style lang="scss" scoped></style>
