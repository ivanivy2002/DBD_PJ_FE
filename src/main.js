import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
// import './assets/element-ui.scss'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

// BUG: 暗色主题
// import 'element-plus/theme-chalk/light/css-vars-light.css'
import './assets/css/light/css-vars-light.css'
// import 'element-plus/theme-chalk/dark/css-vars-dark.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import './assets/css/dark/css-vars-dark.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
