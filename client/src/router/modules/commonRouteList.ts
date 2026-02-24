export default[
    {
        path: '/recommend',
        name: 'recommend',
        component:()=>import('@/modules/common/pages/Recommend.vue'),
        meta:{
            title:'推荐',
            isSelect:true
        }
    },
    {
        path: '/follow',
        name: 'follow',
        component:()=>import('@/modules/common/pages/Follow/Follow.vue')
        ,
        meta:{
            title:'关注',
            isSelect:false
        }
    }
    ,
    {
        path: '/hot',
        name: 'hot',
        component:()=>import('@/modules/common/pages/Hot.vue'),
        meta:{
            title:'最热',
            isSelect:false
        }
    },
    {
        path: '/columns',
        name: 'columns',
        component:()=>import('@/modules/common/pages/Columns.vue'),
        meta:{
            title:'专栏'
        }
    },
    {
        path: '/group',
        name: 'group',
        component:()=>import('@/modules/common/pages/Group.vue'),
        meta:{
            title:'圈子',
            isSelect:false
        }
    }

]