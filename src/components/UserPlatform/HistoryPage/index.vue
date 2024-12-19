<template>
  <t-card>
    <t-form
      :data="selectReq"
      :rules="formRules"
      @submit="submitForm"
    >
      <t-form-item
        name="token"
        label="卡密"
      >
        <t-input v-model="selectReq.token" />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button type="submit"> 查询 </t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-card>

  <t-card>
    <t-table
      row-key="fs_id"
      resizable
      lazy-load
      :bordered="true"
      :data="historyList"
      :pagination="pagination"
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
import { type FormProps, MessagePlugin, type TableProps } from 'tdesign-vue-next'
import { type GetHistoryReq, type GetHistoryRes, getHistory as _getHistory } from '@/api/user/history.ts'
import { copy } from '@/utils/copy.ts'
import { useCommonStore } from '@/utils/use/useCommonStore.ts'
import { onMounted, ref } from 'vue'
import { formatBytes } from '@/utils/format.ts'

const [selectReq, pagination, historyList, getHistory] = useCommonStore<GetHistoryReq, GetHistoryRes>(_getHistory)

const formRules: FormProps['rules'] = {}

const columns = ref<TableProps['columns']>([
  {
    colKey: 'file.filename',
    title: '文件名',
    ellipsis: true,
  },
  {
    colKey: 'ua',
    title: '下载UA',
    cell: (h, { row }) => <t-link onClick={() => copy(row.ua)}>{row.ua}</t-link>,
    ellipsis: true,
  },
  {
    colKey: 'created_at',
    title: '解析时间',
    ellipsis: true,
  },
  {
    colKey: 'size',
    title: '文件大小',
    cell: (h, { row }) => <>{formatBytes(row.file.size)}</>,
    ellipsis: true,
  },
])

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return

  if (!selectReq.value.token) selectReq.value.token = 'guest'

  await getHistory()

  localStorage.setItem('token', selectReq.value.token)

  MessagePlugin.success('查询成功')
}

onMounted(() => {
  selectReq.value.token = localStorage.getItem('token') ?? 'guest'
  submitForm({ validateResult: true })
})
</script>

<style lang="scss" scoped></style>
