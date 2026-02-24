export default [
    {
        path: 'following',
        name: 'following',
        component:()=>import('@/modules/user/components/Follow/components/Following.vue'),
        meta:{
            title:'关注'
        }
    },
    {
        path: 'followers',
        name: 'followers',
        component:()=>import('@/modules/user/components/Follow/components/Followers.vue'),
        meta:{
            title:'粉丝'
        }
    }
]