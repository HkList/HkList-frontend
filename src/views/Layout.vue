<template>
  <t-layout>
    <t-header v-if="isMobile && isColScreen">
      <t-head-menu
        v-model="selectedMenu"
        @change="changeMenu"
      >
        <template #logo>
          <img
            height="28"
            :src="config.logo"
            alt="logo"
          />
          <p class="logo-text">
            {{ config.name }}
          </p>
        </template>

        <slot></slot>
      </t-head-menu>
    </t-header>
    <t-aside v-else>
      <t-menu
        v-model="selectedMenu"
        @change="changeMenu"
        :collapsed="collapsed"
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
            v-if="!collapsed"
          >
            {{ config.name }}
          </p>
        </template>

        <slot></slot>

        <template #operations>
          <t-button
            variant="text"
            shape="square"
            @click="changeCollapsed"
          >
            <template #icon><ViewListIcon /></template>
          </t-button>
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
import { ViewListIcon } from 'tdesign-icons-vue-next'
import { useSelectMenu } from '@/utils/use/useSelectMenu.ts'
import { useConfigStore } from '@/stores/user/config.ts'
import { storeToRefs } from 'pinia'
import { useMobile } from '@/utils/use/useMobile.ts'
import { ref, watch } from 'vue'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const params = defineProps({
  jumpPath: {
    type: String,
    required: true,
  },
  defaultValue: {
    type: String,
    required: true,
  },
})

const [selectedMenu, changeMenu] = useSelectMenu(params.jumpPath, params.defaultValue)

const collapsed = ref(false)

const changeCollapsed = () => {
  collapsed.value = !collapsed.value
}

const [isColScreen, isMobile] = useMobile()
watch(
  isColScreen,
  (val) => {
    collapsed.value = val
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped></style>
