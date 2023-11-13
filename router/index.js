// 1.引入创建路由需要的组件
import { createRouter, createWebHashHistory } from 'vue-router';
// 2.配置系统所有路由页面，浏览器通过path路径加载对应组件
var routes = [
    // { path: '/main', component: () => import('@/views/main.vue') }
    //定义路由
    {
        //路由path
        path: '/el_test',
        //路由name
        name: '/el_test',
        //路由组件
        component: function () { return import('@/components/el_test.vue'); },
        meta: {
            keepAlive: false //不需要缓存
        }
    },
    {
        path: '/home',
        name: '/home',
        component: function () { return import('@/components/HelloWorld.vue'); },
        meta: {
            keepAlive: false //不需要缓存
        }
    },
    {
        path: '/design',
        name: '/design',
        component: function () { return import('@/components/GoGraphDesign.vue'); },
        meta: {
            keepAlive: true //需要缓存
        }
    },
];
// 3.创建路由实例
var router = createRouter({
    //hash模式的路由
    history: createWebHashHistory(),
    routes: routes
});
// 4.声明,为路由提供外部引用的入口
export default router;
//# sourceMappingURL=index.js.map