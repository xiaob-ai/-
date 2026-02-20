import {createWebHashHistory, createRouter } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHashHistory(),
    //@ts-ignore
    routes,
})
export default router