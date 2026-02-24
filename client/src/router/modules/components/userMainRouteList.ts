import userFollowRouteList from "@/router/modules/components/userFollowRouteList.ts";

export default[
    //动态
    //  {
    //      path: 'dynamic',
    //      name: 'dynamic',
    //
    //      component:()=>import('@/modules/user/components/Dynamic.vue'),
    //      meta:{
    //          title:'动态'
    //      }
    //  },
    //回答
     {
         path: 'answer',
         name: 'answer',
         component:()=>import('@/modules/user/components/Answer/Answer.vue'),
          meta:{
              title:'回答'
          }
     },
    //问题
      {
          path: 'question',
          name: 'question',
          component:()=>import('@/modules/user/components/Question/Question.vue'),
          meta:{
              title:'提问'
          }
      },
    //收藏
    //  {
    //      path: 'collect',
    //       name: 'collect',
    //       component:()=>import('@/modules/user/components/Collect.vue'),
    //       meta:{
    //           title:'收藏'
    //       }
    //  },
    //关注
     {
         path: '',
          name: 'followPeople',
          component:()=>import('@/modules/user/components/Follow/Follow.vue'),
         redirect:'/user/people/following',
         children:userFollowRouteList,
          meta:{
              title:'关注订阅'
          }
     }
]