import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
// import './assets/element-ui.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// BUG: 暗色主题
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/dark/css-vars.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
