import '@/assets/base.scss'
import 'tdesign-vue-next/es/style/index.css'

import App from '@/App.vue'
import router from '@/router/index.ts'
import { useI18n } from '@/utils/use/usei18n.ts'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp(App)

app.use(createPinia())
app.use(useI18n())
app.use(router)

app.mount('#app')
