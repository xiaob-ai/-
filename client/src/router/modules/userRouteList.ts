import userMainRouteList from "@/router/modules/components/userMainRouteList.ts";

export default[
    {
        path: 'people',
        name: 'people',
        redirect:'/user/people/answer',
        component:()=>import('@/modules/user/pages/People.vue'),
        children:userMainRouteList,
        meta:{
            title:'个人主页',
            icon:'UserFilled',
            isShowInMenu:true
        }
    },
    {
        path: 'edit',
        name: 'edit',
        component:()=>import('@/modules/user/pages/Edit.vue'),
        meta:{
            title:'编辑资料',
            icon:'Edit',
            isShowInMenu:true
        },
    }
     ,
    {
        path: 'setting',
        name: 'setting',
        component:()=>import('@/modules/user/pages/Setting.vue'),
        meta:{
            title:'设置',
            icon:'Setting',
            isShowInMenu:true
        }
    }

]