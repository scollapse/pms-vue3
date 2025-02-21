import router from '@/router/index'
import { getToken } from '@/composables/utils/cookie'
import toast from './composables/utils/toast'
import { showPageLoading , hidePageLoading} from './composables/utils/mnprogress'

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
    console.log('==> 全局路由前置守卫')

    // 展示页面加载
    showPageLoading()

    // 访问后台 以 /admin 开头的路由，需要登录
    let token = getToken()
    if (to.path.startsWith('/admin') && !token) {
        toast.show('error', '请先登录')
        return next('/login')
    }else if (token && to.path == '/login') {
        // 若用户已经登录，且重复访问登录页
        toast.show('warning', '请勿重复登录')
        // 跳转后台首页
        next({ path: '/admin/index' })
    }
     else {
        next()
    }



})

// 全局路由后置守卫
router.afterEach((to, from) => {
    // 动态修改页面标题
    let titile = to.meta.title || 'PMS'
    document.title = titile
    // 隐藏页面加载 Loading
    hidePageLoading()
})
