<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="proxiesStore.getProxies"
        >
          <t-option
            label="按 id 排序"
            value="id"
          />
          <t-option
            label="按 type 排序"
            value="type"
          />
          <t-option
            label="按 proxy 排序"
            value="proxy"
          />
          <t-option
            label="按 enable 排序"
            value="enable"
          />
          <t-option
            label="按 reason 排序"
            value="reason"
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
          @change="proxiesStore.getProxies"
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

        <t-input
          v-model="selectReq.keyword"
          @blur="proxiesStore.getProxies"
          placeholder="请输入需要查询的代理"
        />

        <t-button @click="proxiesStore.getProxies"> 刷新列表 </t-button>
        <t-button @click="proxiesStore.showAddingProxyDialog"> 添加代理 </t-button>
        <t-button @click="proxiesStore.deleteSelection"> 批量删除 </t-button>
        <t-button @click="proxiesStore.showEditDialog"> 批量编辑 </t-button>
      </t-space>
    </div>

    <AddProxy />
    <UpdateProxy />

    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="proxyList"
      :pagination="pagination"
      :columns="columns"
      :select-on-row-click="true"
      :selectedRowKeys="selectedRowKeys"
      @select-change="proxiesStore.handleSelectChange"
    />
  </t-card>
</template>

<script lang="tsx" setup>
import { useProxiesStore } from '@/stores/admin/proxies.ts'
import { storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import AddProxy from './AddProxy.vue'
import UpdateProxy from './UpdateProxy.vue'
import { typeMap, type SelectRes } from '@/api/admin/proxy.ts'

const proxiesStore = useProxiesStore()
const { selectReq, proxyList, pagination, selectedRowKeys } = storeToRefs(proxiesStore)

onMounted(proxiesStore.getProxies)

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
    colKey: 'type',
    title: '代理类型',
    cell: (h, { row }) => {
      return h('span', typeMap[row.type as SelectRes[0]['type']])
    },
  },
  {
    colKey: 'proxy',
    title: '代理信息',
  },
  {
    colKey: 'status',
    title: '状态',
    cell: (h, { row }) => {
      return h('span', row.enable ? '启用' : `禁用(${row.reason})`)
    },
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
        onClick={(event: PointerEvent) => proxiesStore.showEditDialog(event, row.id)}
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
