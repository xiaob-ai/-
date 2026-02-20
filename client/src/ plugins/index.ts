import {createPinia} from 'pinia'
import  type{App} from 'vue'
import ElementPlus from 'element-plus'
import router from  '../router/index.ts'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia().use(piniaPluginPersistedstate)
import '@/router/guards'
export function registerPlugins(app: App) {
  app.use(pinia)
  app.use(ElementPlus)
  app.use(router)

}

