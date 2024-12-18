<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="accountsStore.getAccounts"
        >
          <t-option
            label="按 id 排序"
            value="id"
          />
          <t-option
            label="按 baidu_name 排序"
            value="baidu_name"
          />
          <t-option
            label="按 uk 排序"
            value="uk"
          />
          <t-option
            label="按 account_type 排序"
            value="account_type"
          />
          <t-option
            label="按 account_data 排序"
            value="account_data"
          />
          <t-option
            label="按 switch 排序"
            value="switch"
          />
          <t-option
            label="按 reason 排序"
            value="reason"
          />
          <t-option
            label="按 prov 排序"
            value="prov"
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
          @change="accountsStore.getAccounts"
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
        <t-button @click="accountsStore.getAccounts"> 刷新列表 </t-button>
        <t-button @click="accountsStore.showAddAccountDialog"> 添加账号 </t-button>
        <t-button
          theme="danger"
          @click="accountsStore.deleteSelection"
        >
          批量删除
        </t-button>
        <t-button @click="accountsStore.updateInfoSelection"> 批量更新账户信息 </t-button>
        <t-button @click="accountsStore.showUpdateSwitchDialog"> 批量启用/禁用 </t-button>
        <t-button @click="accountsStore.showUpdateProvDialog"> 批量更新省份 </t-button>
      </t-space>
    </div>
    <AddAccount />
    <UpdateSwitch />
    <UpdateProv />
    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="accountList"
      :pagination="pagination"
      :columns="columns"
      :select-on-row-click="true"
      :selectedRowKeys="selectedRowKeys"
      @select-change="accountsStore.handleSelectChange"
    >
      <template #expandedRow="{ row }">
        <t-descriptions
          bordered
          colon
          layout="vertical"
        >
          <t-descriptions-item
            v-for="(value, key) in row.account_data"
            :key="key"
            :label="key"
          >
            {{ value }}
          </t-descriptions-item>
        </t-descriptions>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="tsx" setup>
import { ref, onMounted } from 'vue'
import { type TableProps } from 'tdesign-vue-next'
import AddAccount from './AddAccount.vue'
import UpdateProv from './UpdateProv.vue'
import UpdateSwitch from './UpdateSwitch.vue'
import { useAccountsStore } from '@/stores/accounts.ts'
import { formatBytes } from '@/utils/format.ts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { selectReq, accountList, pagination, selectedRowKeys } = storeToRefs(accountsStore)

onMounted(accountsStore.getAccounts)

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
    ellipsis: true,
  },
  {
    colKey: 'baidu_name',
    title: '用户名',
    ellipsis: true,
  },
  {
    colKey: 'uk',
    title: '用户标识',
    ellipsis: true,
  },
  {
    colKey: 'account_type',
    title: '账号类型',
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
    colKey: 'prov',
    title: '省份',
    cell: (h, { row }) => <>{row.prov === null ? '未分配' : row.prov}</>,
    ellipsis: true,
  },
  {
    colKey: 'switch',
    title: '账号状态',
    cell: (h, { row }) => <>{row.switch ? '启用' : `禁用 (${row.reason})`}</>,
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
        onClick={(event: PointerEvent) => accountsStore.checkAccountBanStatus(event, row.id)}
      >
        检查封禁状态
      </t-button>
    ),
    width: 150,
    fixed: 'right',
  },
])
</script>

<style lang="scss" scoped></style>
