<template>
  <t-layout>
    <t-aside>
      <t-menu
        v-model="selectedMenu"
        @change="changeMenu"
      >
        <template
          #logo
          v-if="config.show_hero"
        >
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
      </t-menu>
    </t-aside>
    <t-content>
      <RouterView />
    </t-content>
  </t-layout>
</template>

<script lang="ts" setup>
import { KeyIcon, HistoryIcon, AppIcon, LinkIcon } from 'tdesign-icons-vue-next'
import { useSelectMenu } from '@/utils/use/useSelectMenu.ts'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const custom_button = ref<string[][]>([])
watch(config, () => (custom_button.value = config.value.custom_button.split('\n').map((v) => v.split('|'))))

const [selectedMenu, changeMenu] = useSelectMenu('user', 'parse')
</script>

<style lang="scss" scoped></style>
