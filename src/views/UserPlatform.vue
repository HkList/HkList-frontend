<template>
  <Layout
    jump-path="user"
    default-value="parse"
  >
    <t-menu-item value="parse">
      <template #icon>
        <AppIcon />
      </template>
      解析中心
    </t-menu-item>
    <t-menu-item value="token">
      <template #icon>
        <KeyIcon />
      </template>
      卡密查询
    </t-menu-item>
    <t-menu-item value="history">
      <template #icon>
        <HistoryIcon />
      </template>
      记录查询
    </t-menu-item>
    <t-menu-item
      v-for="button in custom_button"
      :key="button[1]"
      :value="`link-${button[1]}`"
    >
      <template #icon>
        <LinkIcon />
      </template>
      {{ button[0] }}
    </t-menu-item>
  </Layout>
</template>

<script lang="ts" setup>
import { KeyIcon, HistoryIcon, AppIcon, LinkIcon } from 'tdesign-icons-vue-next'
import Layout from '@/views/Layout.vue'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const custom_button = ref<string[][]>([])
watch(config, () => (custom_button.value = config.value.custom_button.split('\n').map((v) => v.split('|'))), { immediate: true })
</script>

<style lang="scss" scoped></style>
