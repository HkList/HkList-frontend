<template>
  <Announce />
  <Form />
  <FilesList />
  <LinksList />
  <Aria2Dialog />
</template>

<script lang="ts" setup>
import Announce from './Announce.vue'
import Form from './Form.vue'
import FilesList from './FilesList.vue'
import LinksList from './LinksList.vue'
import Aria2Dialog from '@/components/UserPlatform/Aria2Dialog.vue'
</script>

<style lang="scss" scoped></style>
