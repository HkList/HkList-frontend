<template>
  <t-card
    v-if="config.show_announce"
    title="公告"
  >
    <div v-html="config.announce"></div>
  </t-card>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@/stores/user/config.ts'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
</script>

<style lang="scss" scoped></style>
