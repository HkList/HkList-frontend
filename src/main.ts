import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useI18n } from '@/utils/use/usei18n.ts'

import App from '@/App.vue'
import router from '@/router/index.ts'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import '@/assets/base.scss'

const app = createApp(App)

app.use(createPinia())
app.use(useI18n())
app.use(router)

app.mount('#app')
