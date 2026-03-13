import commonRouteList from "@/router/modules/commonRouteList.ts";
import authRouteList from "@/router/modules/authRouteList.ts";
import userRouteList from "@/router/modules/userRouteList.ts";
import postRouteList from "@/router/modules/postRouteList.ts";
export default[
    {
        path: '/',
        name: 'Home',
        component:()=>import('@/layouts/DefaultLayout.vue'),
        redirect:'/recommend',
        children:commonRouteList

    },
    {
        path: '/auth',
        name: 'auth',
        component:()=>import('@/layouts/BlankLayout.vue'),
        children: authRouteList,
        redirect: '/login',
    },
    {
        path: '/user',
        name: 'user',
        component:()=>import('@/layouts/DefaultLayout.vue'),
        children: userRouteList,
    },
    {
        path: '/post',
        name: 'post',
        component:()=>import('@/layouts/DefaultLayout.vue'),
        children: postRouteList
    },
    {
        path: '/detail',
        name: 'detail',
        component:()=>import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: ':questionId',
                name: 'QuestionDetail',
                component: () => import('@/modules/Detail/QuestionDetail.vue'),
            }
        ]
    },{
        path: '/chat',
        name: 'chat',
        component:()=>import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: 'private',
                name: 'private',
                component: () => import('@/modules/Chat/Chat.vue'),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component:()=>import('@/modules/common/pages/NotFound.vue'),
    }
]