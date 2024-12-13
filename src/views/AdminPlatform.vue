<template>
  <t-layout>
    <t-aside>
      <t-menu v-model="selectedMenu" @change="changeMenu">
        <template #logo>
          <img height="28" :src="config.logo" alt="logo" />
          <p class="logo-text">{{ config.name }}</p>
        </template>

        <t-menu-item value="account">
          <template #icon>
            <UserIcon />
          </template>
          账号管理
        </t-menu-item>
        <t-menu-item value="token">
          <template #icon>
            <KeyIcon />
          </template>
          卡密管理
        </t-menu-item>
        <t-menu-item value="record">
          <template #icon>
            <ListIcon />
          </template>
          记录管理
        </t-menu-item>
        <t-menu-item value="blacklist">
          <template #icon>
            <UserListIcon />
          </template>
          黑名单管理
        </t-menu-item>
        <t-submenu title="配置管理">
          <template #icon>
            <ToolsIcon />
          </template>
          <t-menu-item value="config/general"> 通用配置 </t-menu-item>
          <t-menu-item value="config/limit"> 限速配置 </t-menu-item>
          <t-menu-item value="config/parse"> 解析配置 </t-menu-item>
          <t-menu-item value="config/mail"> 邮件配置 </t-menu-item>
        </t-submenu>
      </t-menu>
    </t-aside>
    <t-content>
      <RouterView />
    </t-content>
  </t-layout>
</template>

<script lang="ts" setup>
import { KeyIcon, ListIcon, ToolsIcon, UserIcon, UserListIcon } from 'tdesign-icons-vue-next'
import { useSelectMenu } from '@/utils/use/useSelectMenu.ts'
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const [selectedMenu, changeMenu] = useSelectMenu('admin', 'account')
</script>

<style lang="scss" scoped></style>
