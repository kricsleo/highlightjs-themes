import { createApp } from 'vue'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import '../../test/themes/one-dark-pro.css'

const app = createApp(App)
app.mount('#app')
