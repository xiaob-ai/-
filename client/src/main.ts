import { createApp } from 'vue'
import { registerPlugins } from './ plugins'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
registerPlugins(app)
app.mount('#app')

