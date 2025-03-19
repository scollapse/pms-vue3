<template>
  <div class="flex gap-6">
    <!-- 项目卡片网格布局 -->
    <div class="w-full space-y-6 h-full">
      <!-- 项目卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project.projectId"
          class="relative h-[420px] perspective-1000">
          <!-- 卡片容器 - 处理翻转效果 -->
          <div class="w-full h-full transition-transform duration-700 transform-style-preserve-3d"
            :class="{ 'rotate-y-180': project.showDetails }">
            
            <!-- 卡片正面 -->
            <div :class="[
                'absolute w-full h-full backface-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden',
                getCardBgColor(project.status)
              ]">
              <!-- 7日任务数据图表 - 移到上方 -->
              <div class="px-6 pt-6">
                <div class="flex justify-between items-center mb-2">
                  <p class="text-xs text-gray-600 font-medium">近七日任务数据</p>
                </div>
                <div class="h-24">
                  <v-chart class="chart" :option="getProjectChartOption(project)" autoresize />
                </div>
              </div>
              
              <!-- 项目头部 -->
              <div class="p-6 pb-4">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ project.projectName }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
                  </div>
                  <span :class="[
                    'px-2 py-1 rounded-md text-xs font-medium',
                    getStatusClass(project.status)
                  ]">{{ getStatusLabel(project.status) }}</span>
                </div>
                
                <!-- 项目时间信息 - 修改为时间范围 -->
                <div class="mb-4">
                  <p class="text-xs text-gray-500 mb-1">项目周期</p>
                  <p class="text-sm font-medium">{{ formatDate(project.startTime) }} - {{ formatDate(project.endTime) }}</p>
                </div>
                
                <!-- 任务完成情况 -->
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-1">
                    <p class="text-xs text-gray-500">任务完成</p>
                    <p class="text-xs font-medium">{{ project.completedTaskCount }}/{{ project.allTaskCount }}</p>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div :class="[getMorandiProgressColor(getProjectProgress(project)), 'h-2']" 
                      :style="{ width: getProjectProgress(project) + '%' }"></div>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 - 增加不同颜色 -->
              <div class="flex  absolute bottom-0 w-full">
                <button @click="toggleProjectDetails(project)"
                  class="flex-1 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                  查看详情
                </button>
                <button 
                  :class="[
                    'flex-1 py-3 text-sm font-medium border-l border-gray-100 transition-colors duration-200',
                    project.status === 'in_progress' 
                      ? 'text-amber-600 hover:bg-indigo-50' 
                      : 'text-emerald-600 hover:bg-indigo-50'
                  ]">
                  {{ project.status === 'in_progress' ? '暂停' : '开始' }}
                </button>
              </div>
            </div>
            
            <!-- 卡片背面 - 详情页面 -->
            <div :class="[
                'absolute w-full h-full backface-hidden rounded-3xl shadow-sm overflow-hidden rotate-y-180',
                getCardBgColor(project.status)
              ]">
              <div class="flex h-full">
                <!-- 左侧项目详情 -->
                <div class="w-1/3 p-4 border-r border-gray-200 flex flex-col">
                  <h3 class="text-sm font-medium text-gray-700 mb-5">项目详情</h3>
                  
                  <div class="space-y-3 mb-5">
                    <h4 class="text-base font-medium text-gray-900 mb-3">{{ project.projectName }}</h4>
                    <span :class="[
                      'px-2 py-1 rounded-md text-xs font-medium inline-block',
                      getStatusClass(project.status)
                    ]">{{ getStatusLabel(project.status) }}</span>
                    
                    <p class="text-sm text-gray-500">{{ project.description }}</p>
                    
                    <div>
                      <p class="text-xs text-gray-500 mb-3 mt-5">项目周期</p>
                      <p class="text-sm">{{ formatDate(project.startTime) }} - {{ formatDate(project.endTime) }}</p>
                    </div>
                    
                    <div>
                      <div class="flex justify-between items-center mt-20">
                        <p class="text-xs text-gray-500">任务完成</p>
                        <p class="text-xs font-medium">{{ project.completedTaskCount }}/{{ project.allTaskCount }}</p>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div :class="[getMorandiProgressColor(getProjectProgress(project)), 'h-2']" 
                          :style="{ width: getProjectProgress(project) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-auto">
                    <button @click="toggleProjectDetails(project)"
                      class="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200">
                      返回
                    </button>
                  </div>
                </div>
                
                <!-- 右侧任务列表 -->
                <div class="w-2/3 p-4 flex flex-col">
                  <h3 class="text-sm font-medium text-gray-700 mb-2">所有任务</h3>
                  
                  <div class="flex-1 mt-5 overflow-auto">
                    <div v-if="project.tasks && project.tasks.length > 0" class="space-y-2">
                      <div v-for="(task, index) in paginatedTasks(project)" :key="index"
                        class="p-3 bg-white rounded-lg shadow-sm flex items-center gap-3">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          getTaskStatusColor(task.status)
                        ]"></div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ task.taskName }}</p>
                          <p class="text-xs text-gray-500">{{ formatDate(task.endTime) }}</p>
                        </div>
                        <span :class="[
                          'px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap',
                          getPriorityClass(task.priority)
                        ]">{{ getPriorityLabel(task.priority) }}</span>
                      </div>
                    </div>
                    <div v-else class="flex flex-col items-center justify-center h-full py-8">
                      <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <p class="text-sm text-gray-500">暂无任务数据</p>
                    </div>
                  </div>
                  
                  <!-- 分页控件 -->
                  <div v-if="project.tasks && project.tasks.length > 0" class="flex justify-center mt-4 pt-2 border-t border-gray-100">
                    <div class="flex items-center space-x-2">
                      <button @click="prevPage(project)" 
                        :disabled="project.currentPage <= 1"
                        :class="[
                          'p-1 rounded-full transition-colors duration-200',
                          project.currentPage <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                        ]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="text-xs text-gray-600">{{ project.currentPage }} / {{ getTotalPages(project) }}</span>
                      <button @click="nextPage(project)" 
                        :disabled="project.currentPage >= getTotalPages(project)"
                        :class="[
                          'p-1 rounded-full transition-colors duration-200',
                          project.currentPage >= getTotalPages(project) ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                        ]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { fetchProjects } from '@/api/admin/project'
import { fetchTasks } from '@/api/admin/task'
import toast from '@/composables/utils/toast'
import eventBus from '@/composables/utils/eventBus'

// 注册必要的echarts组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent
])

// 项目数据
const projects = ref([])

// 每页显示的任务数量
const tasksPerPage = 4


// 获取分页后的任务列表
const paginatedTasks = (project) => {
  if (!project.tasks) return []
  const start = (project.currentPage - 1) * tasksPerPage
  const end = start + tasksPerPage
  return project.tasks.slice(start, end)
}

// 获取总页数
const getTotalPages = (project) => {
  if (!project.tasks) return 1
  return Math.ceil(project.tasks.length / tasksPerPage)
}

// 上一页
const prevPage = (project) => {
  if (project.currentPage > 1) {
    project.currentPage--
  }
}

// 下一页
const nextPage = (project) => {
  if (project.currentPage < getTotalPages(project)) {
    project.currentPage++
  }
}

// 获取卡片背景色
const getCardBgColor = (status) => {
  const colors = {
    'planning': 'bg-rose-50', 
    'in_progress': 'bg-amber-50',
    'completed': 'bg-emerald-50',
    'paused': 'bg-slate-50',
    'deprecated': 'bg-purple-50'
  }
  return colors[status] || 'bg-gray-50'
} 

// 获取任务状态颜色
const getTaskStatusColor = (status) => {
  const colors = {
    'todo': 'bg-gray-400',
    'in_progress': 'bg-amber-400',
    'completed': 'bg-emerald-400',
    'paused': 'bg-slate-400'
  }
  return colors[status] || 'bg-gray-400'
}

// 生成项目7日任务数据图表配置
const getProjectChartOption = (project) => {
  return {
    grid: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: ['一', '二', '三', '四', '五', '六', '日'],
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: project.weekData,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#60A5FA'
      },
      itemStyle: {
        color: '#60A5FA'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(96, 165, 250, 0.2)' },
          { offset: 1, color: 'rgba(96, 165, 250, 0.05)' }
        ])
      }
    }]
  }
}

// 获取项目进度百分比
const getProjectProgress = (project) => {
  if (project.allTaskCount === 0) return 0
  return Math.round((project.completedTaskCount / project.allTaskCount) * 100)
}

// 获取莫兰迪色系进度条颜色
const getMorandiProgressColor = (progress) => {
  if (progress <= 20) return 'bg-[#D8E2DC]'
  if (progress <= 40) return 'bg-[#FFE5D9]'
  if (progress <= 60) return 'bg-[#FFCAD4]'
  if (progress <= 80) return 'bg-[#F4ACB7]'
  return 'bg-[#9D8189]'
}

// 获取状态样式类
const getStatusClass = (status) => {
  const classes = {
    'planning': 'bg-purple-100 text-purple-800',
    'in_progress': 'bg-amber-100 text-amber-800',
    'completed': 'bg-emerald-100 text-emerald-800',
    'paused': 'bg-slate-100 text-slate-800',
    'deprecated': 'bg-rose-100 text-rose-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 获取优先级样式类
const getPriorityClass = (priority) => {
  const classes = {
    1: 'bg-rose-100 text-rose-800',     // P1 - 高优先级
    2: 'bg-amber-100 text-amber-800',   // P2 - 中优先级
    3: 'bg-emerald-100 text-emerald-800', // P3 - 低优先级
    4: 'bg-blue-100 text-blue-800'      // P4 - 最低优先级
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

// 获取优先级标签
const getPriorityLabel = (priority) => {
  const labels = {
    1: 'P1',
    2: 'P2',
    3: 'P3',
    4: 'P4'
  }
  return labels[priority] || '未设置'
}

// 获取状态标签
const getStatusLabel = (status) => {
  const labels = {
    'planning': '规划中',
    'in_progress': '进行中',
    'completed': '已完成',
    'paused': '已暂停',
    'deprecated': '已废弃'
  }
  return labels[status] || status
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未设置'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 加载项目列表数据
const loadProjects = async () => {
  console.log("loadProjects")
  try {
    const res = await fetchProjects({
      current: 1,
      size: 999 // 看板模式下加载所有项目
    })
    if (res.success) {
      projects.value = res.data.map(project => ({
        ...project,
        showDetails: false,
        currentPage: 1,
        tasks: [],
      }))
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    toast.show('error', '加载项目列表失败')
  }
}

// 加载项目任务数据
const loadProjectTasks = async (project) => {
  try {
    const res = await fetchTasks({
      current: 1,
      size: 999,
      projectId: project.projectId
    })
    if (res.success) {
      project.tasks = res.data
    }
  } catch (error) {
    console.error('Failed to fetch project tasks:', error)
    toast.show('error', '加载项目任务失败')
  }
}

// 切换项目详情显示并加载任务数据
const toggleProjectDetails = async (project) => {
  project.showDetails = !project.showDetails
  if (project.showDetails && (!project.tasks || project.tasks.length === 0)) {
    await loadProjectTasks(project)
  }
}

// 组件挂载时的逻辑
onMounted(async () => {
  await loadProjects()
  // 监听项目更新事件
  eventBus.on('project-updated', loadProjects)
  // 监听项目任务更新事件
  eventBus.on('task-updated', async (projectId) => {
    const project = projects.value.find(p => p.projectId === projectId)
    if (project) {
      await loadProjectTasks(project)
    }
  })
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  eventBus.off('project-updated')
  eventBus.off('task-updated')
})

</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>