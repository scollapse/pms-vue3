<template>
  <div class="bg-gray-100 p-6 rounded-2xl shadow-sm">
    <!-- 顶部标签页 -->
    <div class="mb-6 bg-white p-4 rounded-3xl">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- 任务看板内容 -->
    <div v-show="activeTab === 'task'" class="space-y-6">
      <!-- 统计卡片区域 -->
      <div class="grid grid-cols-3 gap-6 bg-50-50 p-4 rounded-3xl">
        <div v-for="card in statisticsCards" :key="card.id"
          class="bg-rose-50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ card.title }}</h3>
              <div class="mt-2 flex items-baseline">
                <p class="text-4xl font-semibold text-sky-400">{{ card.count }}</p>
                <p class="ml-2 flex items-baseline text-sm font-semibold">
                  <span :class="card.trend > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}%
                  </span>
                </p>
              </div>
            </div>
            <div class="w-64 h-20">
              <v-chart class="chart" :option="getChartOption(card)" autoresize />
            </div>
          </div>
        </div>
      </div>

      <!-- 任务列表和时间线区域 -->
      <div class="grid grid-cols-3 gap-6 p-4 bg-50-50 rounded-3xl">
        <!-- 左侧任务列表 -->
        <div class="col-span-2 bg-lime-50 p-6 rounded-3xl shadow-sm">
          <div class="flex space-x-4 mb-6">
            <button
              v-for="filter in taskFilters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="[
                activeFilter === filter.id
                  ? 'bg-indigo-100 text-rose-400'
                  : 'text-gray-500 hover:text-gray-700',
                'px-4 py-2 rounded-md text-sm font-medium'
              ]"
            >
              {{ filter.name }}
            </button>
          </div>

          <!-- 任务列表 -->
          <div class="space-y-4">
            <div v-for="task in paginatedTasks" :key="task.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ task.name }}</h4>
                <div class="flex items-center space-x-2 mt-1">
                  <p class="text-sm text-gray-500">{{ task.project }}</p>
                  <span :class="[
                    'px-2 py-1 rounded-md text-xs font-medium',
                    getPriorityClass(task.priority)
                  ]">{{ getPriorityLabel(task.priority) }}</span>
                </div>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-for="tag in task.tags" :key="tag"
                    class="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span class="text-sm text-gray-500">{{ task.dueDate }}</span>
                <div class="flex space-x-2">
                  <!-- 开始按钮：todo或wait状态时显示 -->
                  <button v-if="['todo', 'wait'].includes(task.status)"
                    @click="handleTaskAction(task, 'start')"
                    class="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                  
                  <!-- 暂停按钮：进行中状态时显示 -->
                  <button v-if="task.status === 'in_progress'"
                    @click="handleTaskAction(task, 'pause')"
                    class="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-full transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <!-- 完成按钮：进行中状态时显示 -->
                  <button v-if="task.status === 'in_progress'"
                    @click="handleTaskAction(task, 'complete')"
                    class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  <!-- 废弃按钮：todo或in_progress状态时显示 -->
                  <button v-if="['todo', 'in_progress'].includes(task.status)"
                    @click="handleTaskAction(task, 'deprecate')"
                    class="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <!-- 延期按钮：todo或in_progress状态时显示 -->
                  <button v-if="['todo', 'in_progress'].includes(task.status)"
                    @click="handleTaskAction(task, 'delay')"
                    class="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 分页控件 -->
            <div class="flex justify-center space-x-4 mt-6">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="flex items-center text-sm text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧时间线 -->
        <div class=" bg-orange-50 p-6 rounded-3xl shadow-sm">
          <h3 class="text-base  font-normal text-gray-900 mb-4">今日时间线</h3>
          <div class="flow-root">
            <ol class="relative border-s border-gray-200">
              <li v-for="event in timelineEvents" :key="event.id" class="mb-6 ms-6">
                <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                  <svg class="w-2.5 h-2.5 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                  </svg>
                </span>
                <h3 class="mb-1 text-lg font-semibold text-gray-900">{{ event.task }}</h3>
                <time class="block mb-2 text-sm font-normal text-gray-500">{{ event.time }}</time>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- 三状态任务列表 -->
      <div class="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-3xl">
        <div v-for="column in taskColumns" :key="column.id" 
          :class="[
            'p-6 rounded-3xl shadow-sm',
            column.id === 'todo' ? 'bg-yellow-50' : '',
            column.id === 'in_progress' ? 'bg-cyan-50' : '',
            column.id === 'done' ? 'bg-green-100' : ''
          ]">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ column.title }}</h3>
          <div class="space-y-4">
            <div v-for="task in column.tasks" :key="task.id" class="p-4 bg-gray-50 rounded-3xl">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ task.name }}</h4>
                  <p class="text-sm text-gray-500">{{ task.project }}</p>
                </div>
                <span class="text-sm text-gray-500">{{ task.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目看板内容 -->
    <div v-show="activeTab === 'project'" class="space-y-6">
      <!-- 项目看板的内容将在后续实现 -->
      <div class="text-center text-gray-500 py-12">
        项目看板内容开发中...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent
])

// 标签页配置
const tabs = [
  { id: 'task', name: '任务看板' },
  { id: 'project', name: '项目看板' }
]
const activeTab = ref('task')

// 统计卡片数据
const statisticsCards = [
  { 
    id: 1, 
    title: '总任务数', 
    count: 128, 
    trend: 12,
    trendData: [10, 115, 120, 125, 128]
  },
  { 
    id: 2, 
    title: '待办任务', 
    count: 42, 
    trend: -5,
    trendData: [50, 48, 45, 44, 42]
  },
  { 
    id: 3, 
    title: '已办任务', 
    count: 86, 
    trend: 8,
    trendData: [75, 78, 80, 83, 86]
  }
]

// 生成图表配置
const getChartOption = (card) => {
  if (card.id === 1) {
    // 总任务数使用渐变堆叠面积图
    return {
      grid: {
        top: 8,
        right: 8,
        bottom: 8,
        left: 8,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        data: card.trendData,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 0,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(96, 165, 250, 0.35)' },
            { offset: 1, color: 'rgba(96, 165, 250, 0.05)' }
          ])
        }
      }]
    }
  } else {
    // 待办任务和已办任务使用圆环图
    const percentage = card.id === 2 ? 
      (card.count / statisticsCards[0].count * 100).toFixed(0) : 
      (card.count / statisticsCards[0].count * 100).toFixed(0)
    return {
      series: [{
        type: 'pie',
        radius: ['65%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `${percentage}%`,
          fontSize: 20,
          color: card.trend > 0 ? '#10B981' : '#F87171',
          fontWeight: '300'
        },
        emphasis: {
          scale: false,
          focus: 'self'
        },
        data: [
          { 
            value: card.count,
            name: '已完成',
            itemStyle: {
              color: card.trend > 0 ? '#10B981' : '#F87171'
            }
          },
          { 
            value: statisticsCards[0].count - card.count,
            name: '未完成',
            itemStyle: {
              color: '#F9FAFB'
            }
          }
        ]
      }]
    }
  }
}

// 任务筛选器配置
const taskFilters = [
  { id: 'today', name: '今日待办' },
  { id: 'week', name: '本周待办' }
]
const activeFilter = ref('today')

// 模拟任务数据
const tasks = [
  {
    id: 1,
    name: '设计新的用户界面',
    project: 'UI改版项目',
    dueDate: '16 Dec 2024',
    status: 'todo',
    priority: 1,
    tags: ['设计']
  },
  {
    id: 2,
    name: '优化数据库查询',
    project: '性能优化',
    dueDate: '18 Dec 2024',
    status: 'in_progress',
    priority: 2,
    tags: ['后端', '优化']
  },
  {
    id: 3,
    name: '用户反馈分析',
    project: '市场调研',
    dueDate: '20 Dec 2024',
    status: 'completed',
    priority: 3,
    tags: ['分析']
  },
  {
    id: 4,
    name: '移动端适配',
    project: 'UI改版项目',
    dueDate: '22 Dec 2024',
    status: 'wait',
    priority: 2,
    tags: ['前端']
  },
  {
    id: 5,
    name: '支付功能集成',
    project: '电商系统',
    dueDate: '24 Dec 2024',
    status: 'deprecated',
    priority: 1,
    tags: ['后端', '支付']
  },
  {
    id: 6,
    name: '数据可视化',
    project: '数据分析平台',
    dueDate: '26 Dec 2024',
    status: 'todo',
    priority: 2,
    tags: ['前端', '图表']
  },
  {
    id: 7,
    name: '安全漏洞修复',
    project: '系统安全',
    dueDate: '28 Dec 2024',
    status: 'in_progress',
    priority: 1,
    tags: ['安全']
  },
  {
    id: 8,
    name: '性能测试',
    project: '性能优化',
    dueDate: '30 Dec 2024',
    status: 'todo',
    priority: 3,
    tags: ['测试']
  },
  {
    id: 9,
    name: '文档更新',
    project: '技术文档',
    dueDate: '02 Jan 2025',
    status: 'wait',
    priority: 4,
    tags: ['文档']
  },
  {
    id: 10,
    name: 'API接口开发',
    project: '后端服务',
    dueDate: '04 Jan 2025',
    status: 'todo',
    priority: 2,
    tags: ['后端', 'API']
  }
]

// 分页相关
const currentPage = ref(1)
const pageSize = 5

// 根据筛选条件过滤任务
const filteredTasks = computed(() => {
  // 实际项目中根据 activeFilter 值过滤任务
  return tasks
})

// 分页后的任务列表
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTasks.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / pageSize)
})

// 优先级相关函数
const getPriorityClass = (priority) => {
  const classes = {
    1: 'bg-red-100 text-red-800',     // P1 - 红色
    2: 'bg-yellow-100 text-yellow-800', // P2 - 黄色
    3: 'bg-green-100 text-green-800',   // P3 - 绿色
    4: 'bg-blue-100 text-blue-800'      // P4 - 蓝色
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority) => {
  const labels = {
    1: 'P1',
    2: 'P2',
    3: 'P3',
    4: 'P4'
  }
  return labels[priority] || '未知'
}

// 任务操作处理函数
const handleTaskAction = (task, action) => {
  const actionMap = {
    start: { status: 'in_progress', message: '任务已开始' },
    pause: { status: 'wait', message: '任务已暂停' },
    complete: { status: 'completed', message: '任务已完成' },
    deprecate: { status: 'deprecated', message: '任务已废弃' },
    delay: { status: 'wait', message: '任务已延期' }
  }

  const { status, message } = actionMap[action]
  task.status = status
  // 实际项目中这里需要调用API更新任务状态
  console.log(message)
}

// 时间线事件数据
const timelineEvents = [
  {
    id: 1,
    task: '完成首页布局设计',
    time: '09:30'
  },
  {
    id: 2,
    task: '用户反馈分析报告',
    time: '11:00'
  },
  // 更多时间线事件...
]

// 三状态任务列表数据
const taskColumns = [
  {
    id: 'todo',
    title: '待处理',
    tasks: [
      {
        id: 1,
        name: '优化搜索功能',
        project: '性能优化',
        date: '16 Jan 2024'
      },
      // 更多待处理任务...
    ]
  },
  {
    id: 'in_progress',
    title: '进行中',
    tasks: [
      {
        id: 2,
        name: '集成支付系统',
        project: '电商项目',
        date: '18 Jan 2024'
      },
      // 更多进行中任务...
    ]
  },
  {
    id: 'done',
    title: '已完成',
    tasks: [
      {
        id: 3,
        name: '用户调研报告',
        project: '市场分析',
        date: '15 Jan 2024'
      },
      // 更多已完成任务...
    ]
  }
]
</script>