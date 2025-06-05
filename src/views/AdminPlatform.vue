<template>
  <Layout
    jump-path="admin"
    default-value="account"
  >
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
    <t-menu-item value="blacklist">
      <template #icon>
        <UserListIcon />
      </template>
      黑名单管理
    </t-menu-item>
    <t-menu-item value="record">
      <template #icon>
        <ListIcon />
      </template>
      记录管理
    </t-menu-item>
    <t-menu-item value="proxy">
      <template #icon>
        <WorkIcon />
      </template>
      代理配置
    </t-menu-item>
    <t-submenu title="配置管理">
      <template #icon>
        <ToolsIcon />
      </template>
      <t-menu-item value="config/general"> 通用配置 </t-menu-item>
      <t-menu-item value="config/limit"> 限制配置 </t-menu-item>
      <t-menu-item value="config/parse"> 解析配置 </t-menu-item>
      <t-menu-item value="config/mail"> 邮件配置 </t-menu-item>
      <t-menu-item value="config/proxy"> 代理配置 </t-menu-item>
    </t-submenu>
  </Layout>
</template>

<script lang="ts" setup>
import { KeyIcon, ListIcon, ToolsIcon, UserIcon, UserListIcon, WorkIcon } from 'tdesign-icons-vue-next'
import Layout from '@/views/Layout.vue'
</script>

<style lang="scss" scoped></style>
