import { createApp } from 'vue'
import './style.css'
import 'katex/dist/katex.min.css'
import 'markstream-vue/index.css'
// import 'mermaid/dist/mermaid.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(i18n)
  .mount('#app')
