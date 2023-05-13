import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { Quasar } from 'quasar'
import App from './App.vue'
import router from './router'

import './assets/main.css'
// import './assets/element-ui.scss'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
// Import icon libraries
// import '@quasar/extras/material-icons/material-icons.css'

// import 'element-plus/theme-chalk/light/css-vars-light.css'
// import './assets/css/light/css-vars-light.css'
// import 'element-plus/theme-chalk/dark/css-vars-dark.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
// import './assets/css/dark/css-vars-dark.css'
// const myApp = createApp(App)
// myApp.use(router)
// myApp.use(Quasar)
// myApp.use(ElementPlus)
// myApp.mount('#app')
// myApp.use(createPinia())
// myApp.use(Quasar, {
//   plugins: {} // import Quasar plugins and add here
// })

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   myApp.component(key, component)
// }
// myApp.mount('#app')
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')
