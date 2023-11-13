import Vue from 'vue'

// 1.引入创建路由需要的组件
import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'



// 2.配置系统所有路由页面，浏览器通过path路径加载对应组件
const routes = [
    // { path: '/main', component: () => import('@/views/main.vue') }
    //定义路由
    {
        //路由path
        path: '/el_test',
        //路由name
        name: '/el_test',
        //路由组件
        component: () => import('@/components/el_test.vue'),
        meta: {
            keepAlive: true     //需要缓存
        }
    },
    {
        //路由path
        path: '/calculate',
        //路由name
        name: '/calculate',
        //路由组件
        component: () => import('@/components/Demo2.vue'),
        meta: {
            keepAlive: true     //需要缓存
        }
    },

    {
        path: '/design',
        name: '/design',
        component: () => import('@/components/GoGraphDesign.vue'),
        meta: {
            keepAlive: true     //需要缓存
        }
    },
    {
        path: '/goFlowDesign',
        name: '/goFlowDesign',
        component: () => import('@/components/GoFlowGraphDesign.vue'),
        meta: {
            keepAlive: true     //需要缓存
        }
    },
]

// 3.创建路由实例
const router = createRouter({
    //hash模式的路由
    history: createWebHashHistory(),
    routes
})


// 4.声明,为路由提供外部引用的入口
export default router
