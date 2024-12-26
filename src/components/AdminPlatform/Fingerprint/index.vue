<template>
  <t-card>
    <div class="buttons">
      <t-space size="small">
        <t-select
          v-model="selectReq.column"
          @change="fingerprintStore.getFingerprint"
        >
          <t-option
            label="按 id 排序"
            value="id"
          />
          <t-option
            label="按 fingerprint 排序"
            value="fingerprint"
          />
          <t-option
            label="按 ip 排序"
            value="ip"
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
          @change="fingerprintStore.getFingerprint"
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
        <t-button @click="fingerprintStore.getFingerprint"> 刷新列表 </t-button>
      </t-space>
    </div>
    <t-table
      row-key="id"
      resizable
      lazy-load
      :bordered="true"
      :data="fingerprintList"
      :pagination="pagination"
      :columns="columns"
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
import { useFingerprintStore } from '@/stores/admin/fingerprint.ts'
import { storeToRefs } from 'pinia'
import type { TableProps } from 'tdesign-vue-next'
import { onMounted, ref } from 'vue'
import { copy } from '@/utils/copy.ts'

const fingerprintStore = useFingerprintStore()
const { fingerprintList, pagination, selectReq } = storeToRefs(fingerprintStore)

onMounted(fingerprintStore.getFingerprint)

const columns = ref<TableProps['columns']>([
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
  },
  {
    colKey: 'fingerprint',
    title: '指纹',
    width: 400,
    ellipsis: true,
  },
  {
    colKey: 'count(ip)',
    title: 'IP数量',
    cell: (h, { row }) => <>{row.ip.length}</>,
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
    colKey: 'action',
    title: '操作',
    cell: (h, { row }) => <t-button onClick={() => copy(row.fingerprint)}>复制指纹</t-button>,
  },
])
</script>

<style lang="scss" scoped></style>
