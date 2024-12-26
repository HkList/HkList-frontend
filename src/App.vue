<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDark } from '@/utils/use/useDark.ts'
import { getRandomColor } from '@/utils/random.ts'
import { useConfigStore } from '@/stores/user/config'

const configStore = useConfigStore()

onMounted(() => {
  configStore.getConfig()

  useDark()

  // 小彩蛋
  console.info(
    `%c
    ██╗  ██╗   ██╗  ██╗   ██╗        ██╗   ███████╗   ████████╗
    ██║  ██║   ██║ ██╔╝   ██║        ██║   ██╔════╝   ╚══██╔══╝
    ███████║   █████╔╝    ██║        ██║   ███████╗      ██║
    ██╔══██║   ██╔═██╗    ██║        ██║   ╚════██║      ██║
    ██║  ██║   ██║  ██╗   ███████╗   ██║   ███████║      ██║
    ╚═╝  ╚═╝   ╚═╝  ╚═╝   ╚══════╝   ╚═╝   ╚══════╝      ╚═╝   `,
    `font-family: courier; background: linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()});-webkit-background-clip: text;color: transparent;`,
  )
})
</script>

<style scoped></style>
