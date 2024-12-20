<template>
  <t-dialog
    mode="full-screen"
    :closeBtn="false"
    :closeOnEscKeydown="false"
    :closeOnOverlayClick="false"
    :footer="false"
    v-model:visible="isColScreen"
  >
    <div class="content">
      <RotateIcon />
      <p>请切换到横屏使用</p>
    </div>
  </t-dialog>
</template>

<script lang="ts" setup>
import { useMobile } from '@/utils/use/useMobile.ts'
import { RotateIcon } from 'tdesign-icons-vue-next'

const [isColScreen] = useMobile()
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  gap: 30px;

  svg {
    width: 50px;
    height: 50px;
  }
}
</style>
