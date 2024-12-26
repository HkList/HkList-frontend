<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="blacksStore.getBlackLists"
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
            label="按 identifier 排序"
            value="identifier"
          />
          <t-option
            label="按 reason 排序"
            value="reason"
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
        </t-select>
        <t-select
          v-model="selectReq.direction"
          @change="blacksStore.getBlackLists"
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
        <t-button @click="blacksStore.getBlackLists"> 刷新列表 </t-button>
        <t-button @click="blacksStore.showAddBlackList"> 添加黑名单 </t-button>
        <t-button
          theme="danger"
          @click="blacksStore.deleteSelection"
        >
          删除选中黑名单
        </t-button>
        <t-button @click="blacksStore.showUpdateDialog"> 更新黑名单 </t-button>
      </t-space>
    </div>
    <AddBlackList />
    <UpdateBlackList />
    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="blackList"
      :pagination="pagination"
      :columns="columns"
      :select-on-row-click="true"
      :selectedRowKeys="selectedRowKeys"
      @select-change="blacksStore.handleSelectChange"
    />
  </t-card>
</template>

<script lang="tsx" setup>
import { useBlackListStore } from '@/stores/admin/blackList'
import { storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import UpdateBlackList from './UpdateBlackList.vue'
import AddBlackList from './AddBlackList.vue'

const blacksStore = useBlackListStore()
const { blackList, pagination, selectReq, selectedRowKeys } = storeToRefs(blacksStore)

onMounted(blacksStore.getBlackLists)

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
    colKey: 'type',
    title: '类型',
    ellipsis: true,
  },
  {
    colKey: 'identifier',
    title: '识别码',
    ellipsis: true,
  },
  {
    colKey: 'reason',
    title: '原因',
    ellipsis: true,
  },
  {
    colKey: 'expires_at',
    title: '到期时间',
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
        onClick={(event: PointerEvent) => blacksStore.showUpdateDialog(event, row.id)}
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
