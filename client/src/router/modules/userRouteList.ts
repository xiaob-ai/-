import userMainRouteList from "@/router/modules/components/userMainRouteList.ts";

export default[
    {
        path: 'people',
        name: 'people',
        redirect:'/user/people/dynamic',
        component:()=>import('@/modules/user/pages/People.vue'),
        children:userMainRouteList,
        meta:{
            title:'个人主页',
            icon:'UserFilled'
        }
    },
    {
        path: 'visited',
        name: 'visited',
        component:()=>import('@/modules/user/pages/Visited.vue'),
        meta:{
            title:'最近访问',
            icon:'CollectionTag'
        },
    }
     ,
    {
        path: 'setting',
        name: 'setting',
        component:()=>import('@/modules/user/pages/Setting.vue'),
        meta:{
            title:'设置',
            icon:'Setting'
        }
    }

]