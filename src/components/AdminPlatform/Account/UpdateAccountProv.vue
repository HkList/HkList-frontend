<template>
  <t-dialog v-model:visible="isUpdateProvDialog" header="更新账号省份" :footer="false">
    <t-form @submit="submitForm" :labelWidth="130">
      <t-form-item label="省份">
        <t-select v-model="selectedProv">
          <t-option label="未分配" :value="null" />
          <t-option label="北京市" :value="'北京市'" />
          <t-option label="天津市" :value="'天津市'" />
          <t-option label="上海市" :value="'上海市'" />
          <t-option label="重庆市" :value="'重庆市'" />
          <t-option label="河北省" :value="'河北省'" />
          <t-option label="山西省" :value="'山西省'" />
          <t-option label="内蒙古自治区" :value="'内蒙古自治区'" />
          <t-option label="辽宁省" :value="'辽宁省'" />
          <t-option label="吉林省" :value="'吉林省'" />
          <t-option label="黑龙江省" :value="'黑龙江省'" />
          <t-option label="江苏省" :value="'江苏省'" />
          <t-option label="浙江省" :value="'浙江省'" />
          <t-option label="安徽省" :value="'安徽省'" />
          <t-option label="福建省" :value="'福建省'" />
          <t-option label="江西省" :value="'江西省'" />
          <t-option label="山东省" :value="'山东省'" />
          <t-option label="河南省" :value="'河南省'" />
          <t-option label="湖北省" :value="'湖北省'" />
          <t-option label="湖南省" :value="'湖南省'" />
          <t-option label="广东省" :value="'广东省'" />
          <t-option label="广西壮族自治区" :value="'广西壮族自治区'" />
          <t-option label="海南省" :value="'海南省'" />
          <t-option label="四川省" :value="'四川省'" />
          <t-option label="贵州省" :value="'贵州省'" />
          <t-option label="云南省" :value="'云南省'" />
          <t-option label="西藏自治区" :value="'西藏自治区'" />
          <t-option label="陕西省" :value="'陕西省'" />
          <t-option label="甘肃省" :value="'甘肃省'" />
          <t-option label="青海省" :value="'青海省'" />
          <t-option label="宁夏回族自治区" :value="'宁夏回族自治区'" />
          <t-option label="新疆维吾尔自治区" :value="'新疆维吾尔自治区'" />
          <t-option label="香港特别行政区" :value="'香港特别行政区'" />
          <t-option label="澳门特别行政区" :value="'澳门特别行政区'" />
          <t-option label="台湾省" :value="'台湾省'" />
        </t-select>
      </t-form-item>

      <t-form-item label="选中的账号">
        <t-input :value="selectedRowKeys.toString()" disabled />
      </t-form-item>

      <t-form-item>
        <t-space size="small">
          <t-button theme="default" @click="accountsStore.hideUpdateProvDialog">取消</t-button>
          <t-button theme="primary" type="submit">提交</t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script lang="ts" setup>
import { type FormProps } from 'tdesign-vue-next'
import { useAccountsStore } from '@/stores/accounts.ts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { isUpdateProvDialog, selectedProv, selectedRowKeys } = storeToRefs(accountsStore)

const submitForm: FormProps['onSubmit'] = async ({ validateResult }) => {
  if (validateResult !== true) return
  await accountsStore.updateProvSelection()
  await accountsStore.hideUpdateProvDialog()
}
</script>

<style lang="scss" scoped></style>
