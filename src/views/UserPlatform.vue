<template>
  <t-layout>
    <t-aside>
      <t-menu
        v-model="selectedMenu"
        @change="changeMenu"
      >
        <template #logo>
          <img
            height="28"
            :src="config.logo"
            alt="logo"
          />
          <p class="logo-text">{{ config.name }}</p>
        </template>
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
      </t-menu>
    </t-aside>
    <t-content>
      <RouterView />
    </t-content>
  </t-layout>
</template>

<script lang="ts" setup>
import { KeyIcon, HistoryIcon, AppIcon } from 'tdesign-icons-vue-next'
import { useSelectMenu } from '@/utils/use/useSelectMenu.ts'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [selectedMenu, changeMenu] = useSelectMenu('user', 'parse')
</script>

<style lang="scss" scoped></style>
