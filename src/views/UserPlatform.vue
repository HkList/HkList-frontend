<template>
  <t-layout>
    <t-aside>
      <t-menu
        v-model="selectedMenu"
        @change="changeMenu"
        :collapsed="isColScreen"
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
          <p
            class="logo-text"
            v-if="!isColScreen"
          >
            {{ config.name }}
          </p>
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

        <template #operations>
          <t-space :direction="isColScreen ? 'vertical' : 'horizontal'">
            <p>前端: {{ config.frontend_version }}</p>
            <p>后端: {{ config.version }}</p>
          </t-space>
        </template>
      </t-menu>
    </t-aside>
    <t-content>
      <div class="content">
        <RouterView />
      </div>
    </t-content>
  </t-layout>
</template>

<script lang="ts" setup>
import { KeyIcon, HistoryIcon, AppIcon, LinkIcon } from 'tdesign-icons-vue-next'
import { useSelectMenu } from '@/utils/use/useSelectMenu.ts'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useMobile } from '@/utils/use/useMobile.ts'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const custom_button = ref<string[][]>([])
watch(config, () => (custom_button.value = config.value.custom_button.split('\n').map((v) => v.split('|'))))

const [selectedMenu, changeMenu] = useSelectMenu('user', 'parse')

const [isColScreen] = useMobile()
</script>

<style lang="scss" scoped></style>
