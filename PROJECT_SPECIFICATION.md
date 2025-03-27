# PMS-Vue3 项目规范文档

## 1. 项目概述

PMS-Vue3是一个基于Vue 3、Vite和Tailwind CSS的项目管理系统前端项目，包含项目管理、任务管理、标签管理、健康管理和习惯打卡等功能模块。项目采用组件化开发，使用Pinia进行状态管理，Vue Router进行路由管理。

## 2. 技术栈

- **核心框架**：Vue 3.5.x (组合式API)
- **构建工具**：Vite 6.0.x
- **状态管理**：Pinia 2.3.x
- **路由管理**：Vue Router 4.5.x
- **UI框架**：Tailwind CSS 3.4.x + Element Plus 2.3.x
- **HTTP请求**：Axios 1.7.x
- **图表库**：ECharts 5.6.x + Chart.js 4.4.x
- **工具库**：
  - VueUse (组合式API工具集)
  - date-fns (日期处理)
  - NProgress (加载进度条)
  - FontAwesome (图标库)

## 3. 目录结构

```
/pms-vue3
├── public/                 # 静态资源目录
├── src/                    # 源代码目录
│   ├── api/                # API接口目录
│   │   ├── admin/         # 后台API
│   │   └── frontend/      # 前台API
│   ├── assets/            # 资源文件(图片、样式等)
│   │   ├── styles/        # 全局样式
│   │   └── ...            # 其他资源
│   ├── components/        # 全局公共组件
│   │   ├── habit/         # 习惯打卡相关组件
│   │   └── ...            # 其他组件
│   ├── composables/       # 组合式函数
│   │   ├── admin/         # 管理后台相关
│   │   ├── utils/         # 工具函数
│   │   └── ...            # 其他组合式函数
│   ├── layouts/           # 布局组件
│   │   └── admin/         # 后台布局
│   ├── pages/             # 页面组件
│   │   ├── admin/         # 后台页面
│   │   │   ├── habit/     # 习惯打卡模块
│   │   │   ├── health/    # 健康管理模块
│   │   │   └── ...        # 其他模块
│   │   └── frontend/      # 前台页面
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia状态管理
│   │   ├── habit/         # 习惯打卡状态
│   │   └── ...            # 其他状态
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   ├── permission.js      # 权限控制
│   └── axios.js           # Axios配置
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── vite.config.js         # Vite配置
└── tailwind.config.js     # Tailwind配置
```

## 4. 命名规范

### 4.1 文件命名

- **组件文件**：使用PascalCase (如`HabitCard.vue`)
- **页面文件**：使用PascalCase (如`HabitPage.vue`)
- **工具/辅助文件**：使用camelCase (如`useHabit.js`)
- **API文件**：使用camelCase (如`habitApi.js`)

### 4.2 组件命名

- **组件名**：使用PascalCase (如`<HabitCard />`)
- **组件prop**：使用camelCase (如`:habitData`)
- **自定义事件**：使用kebab-case (如`@habit-added`)

### 4.3 变量命名

- **常量**：使用UPPER_SNAKE_CASE (如`MAX_ITEMS`)
- **变量**：使用camelCase (如`selectedDate`)
- **私有变量**：使用下划线前缀 (如`_privateVar`)
- **Store状态**：使用camelCase (如`habits`)

## 5. 组件结构

### 5.1 组件目录结构

```
/components
├── common/              # 通用组件
├── layout/              # 布局组件
└── habit/               # 习惯打卡模块组件
    ├── HabitCard.vue    # 习惯卡片组件
    ├── HabitIcon.vue    # 习惯图标组件
    ├── HabitModal.vue   # 习惯表单模态框
    └── ...
```

### 5.2 组件编写规范

- 使用`<script setup>`语法
- 使用组合式API (Composition API)
- 组件props使用运行时验证
- 使用`defineEmits`定义事件
- 使用`defineProps`定义属性

```vue
<script setup>
import { ref, computed } from 'vue';

// 定义props
const props = defineProps({
  habit: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['update']);

// 组件逻辑
const isCompleted = ref(false);

function completeHabit() {
  isCompleted.value = !isCompleted.value;
  emit('update', { ...props.habit, completed: isCompleted.value });
}
</script>
```

## 6. 状态管理

### 6.1 Pinia Store结构

项目使用Pinia进行状态管理，每个功能模块有独立的Store：

```
/stores
├── user.js          # 用户状态
├── menu.js          # 菜单状态
├── tab.js           # 标签页状态
└── habit/           # 习惯打卡状态
    └── index.js     # 习惯状态管理
```

### 6.2 Store编写规范

- 使用组合式API风格定义Store
- 使用`defineStore`创建Store
- 使用`ref`/`reactive`定义状态
- 使用`computed`定义计算属性
- 使用普通函数定义actions

```js
// stores/habit/index.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHabitStore = defineStore('habit', () => {
  // 状态
  const habits = ref([]);
  const selectedDate = ref(new Date());
  
  // 计算属性
  const habitsByDate = computed(() => {
    // 返回特定日期的习惯
  });
  
  // Actions
  function addHabit(habit) {
    habits.value.push(habit);
  }
  
  function completeHabit(habitId) {
    // 完成习惯的逻辑
  }
  
  return {
    habits,
    selectedDate,
    habitsByDate,
    addHabit,
    completeHabit
  }
}, {
  persist: true // 持久化存储
});
```

## 7. 路由管理

### 7.1 路由结构

```js
// router/index.js
const routes = [
  {
    path: '/',
    component: Index,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: 'PMS 登录页'
    }
  },
  {
    path: "/admin",
    component: Admin,
    children: [
      // 习惯打卡相关路由
      {
        path: "/admin/habit/index",
        component: () => import('@/pages/admin/habit/HabitPage.vue'),
        meta: {
          title: '习惯打卡'
        }
      },
      {
        path: "/admin/habit/achievement",
        component: () => import('@/pages/admin/habit/HabitAchievement.vue'),
        meta: {
          title: '成就系统'
        }
      },
      {
        path: "/admin/habit/store",
        component: () => import('@/pages/admin/habit/HabitStore.vue'),
        meta: {
          title: '奖励商城'
        }
      }
    ]
  }
];
```

### 7.2 路由守卫

项目使用全局前置守卫进行权限控制和路由拦截：

```js
// permission.js
import router from './router'
import { useUserStore } from './stores/user'

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'PMS系统'
  
  // 权限控制逻辑
  const userStore = useUserStore()
  
  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

## 8. 习惯打卡模块

### 8.1 模块结构

习惯打卡模块是项目的核心功能之一，包含以下组件和页面：

- **页面组件**：
  - `HabitPage.vue` - 习惯打卡主页面
  - `HabitAchievement.vue` - 成就系统页面
  - `HabitStore.vue` - 奖励商城页面

- **功能组件**：
  - `HabitCard.vue` - 习惯卡片组件
  - `HabitCardWrapper.vue` - 习惯卡片容器
  - `HabitIcon.vue` - 习惯图标组件
  - `HabitModal.vue` - 习惯表单模态框
  - `StatisticCard.vue` - 统计卡片组件
  - `AchievementCard.vue` - 成就卡片组件
  - `RewardCard.vue` - 奖励卡片组件

### 8.2 数据流

习惯打卡模块的数据流如下：

1. 用户在`HabitPage`页面查看和管理习惯
2. 通过`HabitStore`管理习惯数据
3. 用户可以添加、编辑、删除和完成习惯
4. 完成习惯后获得积分，可在`HabitStore`页面兑换奖励
5. 达成特定条件后解锁成就，在`HabitAchievement`页面查看

### 8.3 组件关系

```
HabitPage
├── DatePicker (日期选择)
├── StatisticCard (统计卡片)
├── CalendarHeatmap (热力图)
├── HabitCardWrapper (习惯分类容器)
│   └── HabitCard (习惯卡片)
│       └── HabitIcon (习惯图标)
└── HabitModal (添加/编辑习惯)

HabitAchievement
└── AchievementCard (成就卡片)

HabitStore
└── RewardCard (奖励卡片)
```

## 9. API调用规范

### 9.1 API目录结构

```
/api
├── admin/              # 后台API
│   ├── habitApi.js     # 习惯相关API
│   └── ...
└── frontend/          # 前台API
```

### 9.2 API调用示例

```js
// api/admin/habitApi.js
import request from '@/axios'

export function getHabitList(params) {
  return request({
    url: '/api/habits',
    method: 'get',
    params
  })
}

export function addHabit(data) {
  return request({
    url: '/api/habits',
    method: 'post',
    data
  })
}

export function completeHabit(id, data) {
  return request({
    url: `/api/habits/${id}/complete`,
    method: 'post',
    data
  })
}
```

## 10. 样式规范

### 10.1 Tailwind CSS

项目使用Tailwind CSS进行样式开发，遵循以下规范：

- 优先使用Tailwind提供的工具类
- 对于复杂组件，使用`@apply`指令组合工具类
- 使用主题配置统一颜色和尺寸

### 10.2 样式示例

```html
<!-- 使用Tailwind工具类 -->
<div class="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300">
  <!-- 内容 -->
</div>

<!-- 使用@apply组合工具类 -->
<style scoped>
.habit-card {
  @apply bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300;
}

.habit-card:hover {
  @apply shadow-md -translate-y-1;
}
</style>
```

## 11. 开发规范

### 11.1 代码风格

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue官方风格指南

### 11.2 提交规范

提交信息格式：`<type>(<scope>): <subject>`

类型(type)：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式(不影响代码运行的变动)
- refactor: 重构(既不是新增功能，也不是修改bug的代码变动)
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动

### 11.3 注释规范

- 组件顶部添加组件说明
- 复杂逻辑添加注释说明
- API函数添加参数和返回值说明

```js
/**
 * 习惯卡片组件
 * 用于展示单个习惯的信息和状态
 */

/**
 * 完成习惯
 * @param {Object} habit - 习惯对象
 * @returns {Promise} - 返回API请求Promise
 */
function completeHabit(habit) {
  // 实现逻辑
}
```

## 12. 构建与部署

### 12.1 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 12.2 生产环境

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 12.3 环境变量

使用`.env`文件管理环境变量：

- `.env` - 所有环境共享的变量
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量

## 13. 总结

PMS-Vue3项目是一个基于Vue 3的现代化前端项目，采用组件化开发和模块化管理，使用Pinia进行状态管理，Vue Router进行路由管理，Tailwind CSS进行样式开发。项目结构清晰，代码规范统一，便于团队协作和维护。

习惯打卡模块是项目的核心功能之一，包含习惯管理、成就系统和奖励商城等功能，通过组件化设计和状态管理，实现了高度的可维护性和可扩展性。