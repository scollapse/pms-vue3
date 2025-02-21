import Index from '@/pages/frontend/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/pages/admin/login.vue'
import AdminIndex from '@/pages/admin/index.vue'
import Admin from '@/layouts/admin/admin.vue'
import AdminTagList from '@/pages/admin/tag/TagPage.vue'

//统一在这里声明所有路由
const routes = [
    {
        path: '/',//路由地址
        component: Index,//路由组件
        meta: {
            title: '首页'//页面标题
        }
    },
    {
        path: '/login',//登录页
        component: Login,
        meta: {
            title: 'PMS 登录页'
        }
    },
    {
        path: "/admin", // 后台首页
        component: Admin, // 对应 admin.vue 布局文件
        // 使用到 admin.vue 布局的，都需要放置在其子路由下面
        children: [
            {
                path: "/admin/index",
                component: AdminIndex,
                meta: {
                    title: '仪表盘'
                }
            },
            {
                path: "/admin/tag/list",
                component: AdminTagList,
                meta: {
                    title: '标签管理'
                }
            }
        ]
        
    }
]

// 创建路由
const router = createRouter({
    // 指定路由的历史管理模式，createWebHashHistory()表示使用hash模式，hash 模式指的是将路由信息存储在URL的hash部分，URL 的路径通过 # 号标记，如：http://localhost:8080/#/about
    history: createWebHashHistory(),
    routes // short for `routes: routes`
})

//ES6 模块导出语句 
export default router