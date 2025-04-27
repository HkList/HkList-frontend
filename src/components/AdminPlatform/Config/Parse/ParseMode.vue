<template>
  <t-select
    v-model="parse_mode"
    @change="emits('change')"
    @blur="emits('blur')"
  >
    <t-option
      label="V0免费-SVIP-盘内"
      :value="0"
    />
    <t-option
      label="V1-SVIP-盘内"
      :value="1"
    />
    <t-option
      label="V2-SVIP-盘外"
      :value="2"
    />
    <t-option
      label="V3开放平台-SVIP-盘内"
      :value="3"
    />
    <t-option
      label="V4开放平台-SVIP-盘内"
      :value="4"
    />
    <t-option
      label="V5企业-企业套餐-盘内"
      :value="5"
    />
    <t-option
      label="V6企业-下载卷-盘内"
      :value="6"
    />
    <t-option
      label="V7企业-企业套餐-盘外"
      :value="7"
    />
  </t-select>
</template>

<script lang="ts" setup>
const parse_mode = defineModel()
const emits = defineEmits(['change', 'blur'])
</script>

<style lang="scss" scoped></style>
