<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-button theme="primary" @click="accountsStore.getAccounts">刷新列表</t-button>
        <t-button theme="primary" @click="accountsStore.showAddDialog">添加账号</t-button>
        <t-button theme="danger" @click="accountsStore.deleteSelection">批量删除</t-button>
        <t-button theme="primary" @click="accountsStore.updateInfoSelection">批量更新</t-button>
        <t-button theme="primary" @click="accountsStore.enableSelection">批量启用</t-button>
        <t-button theme="danger" @click="accountsStore.disableSelection">批量禁用</t-button>
        <t-button theme="primary" @click="accountsStore.showUpdateProvDialog">
          批量更新省份
        </t-button>
      </t-space>
    </div>
    <AddAccount />
    <UpdateAccountProv />
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
      :expandIcon="true"
      :expanded-row-keys="expandedRowKeys"
      @expand-change="accountsStore.handleExpandChange"
    >
      <template #expandedRow="{ row }">
        <div class="more-detail">
          <ul v-for="(value, key) in row.account_data" :key="key">
            <li>{{ key }}:</li>
            <li>{{ value }}</li>
          </ul>
        </div>
      </template>
    </t-table>
  </t-card>
</template>

<script lang="tsx" setup>
import { ref, onMounted } from 'vue'
import { type TableProps } from 'tdesign-vue-next'
import AddAccount from './AddAccount.vue'
import UpdateAccountProv from './UpdateAccountProv.vue'
import { useAccountsStore } from '@/stores/accounts.ts'
import { formatIsoString } from '@/utils/format.ts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { accountList, pagination, selectedRowKeys, expandedRowKeys } = storeToRefs(accountsStore)

onMounted(accountsStore.getAccounts)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
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
    colKey: 'prov',
    title: '省份',
    ellipsis: true,
  },
  {
    colKey: 'switch',
    title: '账号状态',
    cell: (h, { row }) => <>{row.switch ? '启用' : '禁用'}</>,
    ellipsis: true,
  },
  {
    colKey: 'reason',
    title: '禁用原因',
    cell: (h, { row }) => <>{row.reason === '' ? '未封禁' : row.reason}</>,
    ellipsis: true,
  },
  {
    colKey: 'created_at',
    title: '创建时间',
    cell: (h, { row }) => <>{formatIsoString(row.created_at)}</>,
    ellipsis: true,
  },
  {
    colKey: 'updated_at',
    title: '更新时间',
    cell: (h, { row }) => <>{formatIsoString(row.updated_at)}</>,
    ellipsis: true,
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => (
      <t-button
        theme="primary"
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

<style lang="scss" scoped>
.more-detail {
  line-height: 22px;

  ul {
    padding: 0 10px;
    list-style: none;
    width: 99%;
    display: flex;

    > li:first-child {
      font-weight: bold;
      width: 100px;
    }

    > li:last-child {
      width: calc(100% - 100px);
    }
  }
}
</style>
