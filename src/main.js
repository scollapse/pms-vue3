import { createApp } from 'vue' // 引入 createApp 方法
import App from '@/App.vue'     // 引入 App.vue 组件
import { pinia } from '@/store' // 引入 Pinia
import router from '@/router' // 引入路由模块
// 导入全局路由守卫 需要放在 router 之后
import '@/permission'
import '@/assets/main.css'      // 引入 main.css 样式文件
import 'animate.css'; // 引入 animate.css 动画库
import 'nprogress/nprogress.css' // 引入 nprogress.css 样式文件
import '@fortawesome/fontawesome-free/css/all.css';//引入 font-awesome 图标库
import '@/assets/styles/form.css'

const app = createApp(App)
app.use(router) // 注册路由
app.use(pinia) // 应用 Pinia
app.mount('#app') // 挂载到 <div id="#app"></div> 中