export default[
    {
        path: 'select-answer',
        name: 'select-answer',
        component:()=>import('@/modules/post/pages/SelectAnswer.vue'),
        redirect:'/post/select-answer',
        children: [{
            path: 'write',
            name: 'write-answer',
            component:()=>import('@/modules/post/components/WriteAnswer.vue'),
        },
            {
                path:'',
                name:'select-answer-main',
                component:()=>import('@/modules/post/components/SelectAnswerMain.vue'),
            }],
        meta:{
            title:'写回答',
            icon :'Edit',
            iconColor:'#ff9900',
            module:'post'
        }
    },
    {
        path: 'question',
        name: 'create-question',
        component:()=>import('@/modules/post/pages/CreateQuestion.vue'),

        meta:{
            title:'提问题',
            icon :'ChatDotSquare',
            iconColor:'#22d0fb'
            ,
            module:'post'
        }
    },

]