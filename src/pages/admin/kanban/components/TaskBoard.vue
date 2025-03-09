<template>
  <div class="flex gap-6">
    <!-- 左侧区域 - 占据2/3空间 -->
    <div class="w-3/5 space-y-6 h-full">
      <!-- 统计卡片区域 -->
      <div class="grid grid-cols-3 gap-6 bg-50-50 p-4 rounded-3xl">
        <div v-for="card in statisticsCards" :key="card.id"
          class="bg-rose-50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ card.title }}</h3>
              <div class="mt-2 flex items-baseline">
                <p class="text-4xl font-semibold text-sky-400">{{ card.count }}</p>
              </div>
            </div>
            <div class="w-64 h-20">
              <v-chart class="chart" :option="getChartOption(card)" autoresize />
            </div>
          </div>
        </div>
      </div>

      <!-- 三状态任务列表 -->
      <div class="grid grid-cols-3 gap-6 bg-white p-4 rounded-3xl">
        <div v-for="column in taskColumns" :key="column.id" :class="[
          'p-6 rounded-3xl shadow-sm',
          column.id === 'todo' ? 'bg-yellow-50' : '',
          column.id === 'in_progress' ? 'bg-cyan-50' : '',
          column.id === 'done' ? 'bg-green-100' : ''
        ]">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ column.title }}</h3>
          <div class="space-y-4">
            <div v-for="task in column.tasks" :key="task.id" class="p-4 bg-white rounded-3xl">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ task.name }}</h4>
                  <p class="text-sm text-gray-500">{{ task.project }}</p>
                </div>
                <span class="text-sm text-gray-500">{{ dayjs(task.date).format('D MMM YYYY') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务热力图 -->
      <div class="bg-purple-100 p-4 rounded-3xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">任务分布热力图</h3>
          <div class="flex space-x-2">
            <button @click="viewMode = 'year'" :class="[
          'px-3 py-1 text-sm rounded-md',
          viewMode === 'year' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
        ]">
              年视图
            </button>
            <button @click="viewMode = 'month'" :class="[
          'px-3 py-1 text-sm rounded-md',
          viewMode === 'month' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
        ]">
              月视图
            </button>
          </div>
        </div>
        <div class="p-6 bg-violet-50 rounded-3xl shadow-sm overflow-x-auto">
          <CalendarHeatmap v-if="viewMode === 'year'" :values="heatmapData" :end-date="dayjs().format('YYYY-MM-DD')"
            :tooltip-unit="'个任务'" :range-color="['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']"
            :round="5" :dark-mode="false" class="rounded-xl overflow-hidden text-xs" style="font-size: 10px;" />
          <MonthHeatmap v-else :month="currentMonth" :values="monthHeatmapData" :max="monthDataMax"
            :range-colors="['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']" :round="5" :dark-mode="false"
            :tooltip-unit="'个任务'" class="rounded-xl overflow-hidden text-xs" style="font-size: 10px;" />
        </div>
      </div>
    </div>
    <!-- 任务列表区域 -->
    <div class="bg-lime-50 rounded-3xl shadow-sm flex-1 mt-2 p-6 overflow-hidden min-h-[calc(50%-12px)] flex flex-col">
      <div class="flex space-x-4 mb-6">
        <button v-for="filter in taskFilters" :key="filter.id" @click="activeFilter = filter.id" :class="[
          activeFilter === filter.id
            ? 'bg-indigo-100 text-rose-400'
            : 'text-gray-500 hover:text-gray-700',
          'px-4 py-2 rounded-md text-sm font-medium'
        ]">
          {{ filter.name }}
        </button>
      </div>

      <!-- 任务列表 -->
      <div class="flex-1 overflow-auto">
        <!-- 加载中状态 -->
        <div v-if="isTasksLoading" class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
        <!-- 无数据提示 -->
        <div v-else-if="paginatedTasks.length === 0" class="flex flex-col justify-center items-center h-full">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500 text-lg">暂无任务数据</p>
          <p class="text-gray-400 text-sm mt-2">当前筛选条件下没有找到任务</p>
        </div>
        <!-- 任务列表内容 -->
        <div v-else class="space-y-4">
          <div v-for="task in paginatedTasks" :key="task.id"
            class="flex items-center justify-between p-4 bg-white rounded-3xl hover:bg-gray-100 transition-colors duration-200">
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900">{{ task.taskName }}</h4>
              <div class="flex items-center space-x-2 mt-1">
                <p class="text-sm text-gray-500">{{ task.projectName }}</p>
                <span :class="[
                  'px-2 py-1 rounded-md text-xs font-medium',
                  getPriorityClass(task.priority)
                ]">{{ getPriorityLabel(task.priority) }}</span>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span v-for="tag in task.tags" :key="tag.id"
                  class="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  {{ tag.name }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span class="text-sm text-gray-500">{{ new Date(task.endTime).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short', year: 'numeric'
              }) }}</span>
              <div class="flex space-x-2" v-if="activeFilter !== 'week'">
                <!-- 开始按钮：todo或wait状态时显示 -->
                <button v-if="['todo', 'wait'].includes(task.status)" @click="handleTaskAction(task, 'start')"
                  class="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <!-- 暂停按钮：进行中状态时显示 -->
                <button v-if="task.status === 'in_progress'" @click="handleTaskAction(task, 'pause')"
                  class="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-full transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <!-- 完成按钮：进行中状态时显示 -->
                <button v-if="['todo', 'wait', 'in_progress'].includes(task.status)"
                  @click="handleTaskAction(task, 'complete')"
                  class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                <!-- 废弃按钮：todo或in_progress状态时显示 -->
                <button v-if="['todo', 'in_progress', 'wait'].includes(task.status)"
                  @click="handleTaskAction(task, 'deprecate')"
                  class="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <!-- 延期按钮：todo或in_progress状态时显示 -->
                <button v-if="['todo', 'in_progress', 'wait'].includes(task.status)"
                  @click="handleTaskAction(task, 'delay')"
                  class="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full transition-colors duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex justify-center space-x-4 mt-6 pt-4 border-t border-gray-200">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="flex items-center text-sm text-gray-600">{{ totalPages === 0 ? '0 / 0' : `${currentPage} /
          ${totalPages}` }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0"
          class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    <!-- 时间线区域 - 使用不同背景色 -->
    <div class="bg-blue-50 rounded-3xl shadow-sm flex-1 mt-2 p-6 overflow-hidden min-h-[calc(50%-12px)] flex flex-col">
      <h3 class="text-base font-normal text-gray-900 mb-4">今日时间线</h3>
      <div v-if="timelineEvents.length > 0" class="flow-root p-4">
        <ol  class="relative border-s border-gray-200 ">
          <li v-for="event in timelineEvents" :key="event.id" class="mb-6 ms-6">
            <span
              class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
              <svg class="w-2.5 h-2.5 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </span>
            <h3 class="mb-1 text-lg font-semibold text-gray-900">{{ event.task }}</h3>
            <time class="block mb-2 text-sm font-normal text-gray-500">{{ event.time }}</time>
          </li>
        </ol>
      </div>
      <div v-else class="flex flex-col justify-center items-center h-full mb-14">
          <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500 text-lg">暂无时间线数据</p>
          <p class="text-gray-400 text-sm mt-2">今日暂无已完成任务</p>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import { fetchTaskStatistics, fetchTasks, updateTask } from '@/api/admin/task'
import toast from '@/composables/utils/toast'
import dayjs from 'dayjs'
import CalendarHeatmap from '@/components/CalendarHeatmap.vue'
import MonthHeatmap from '@/components/MonthHeatmap.vue'
import eventBus from '@/composables/utils/eventBus'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent
])

// 统计卡片数据
const statisticsCards = ref([
  {
    id: 1,
    title: '总任务数',
    count: 0,
    trendData: []
  },
  {
    id: 2,
    title: '待办任务',
    count: 0,
  },
  {
    id: 3,
    title: '已办任务',
    count: 0,
  }
])

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await fetchTaskStatistics()
    if (response.success) {
      statisticsCards.value[0].count = response.data.total
      statisticsCards.value[0].trendData = response.data.trendData
      statisticsCards.value[1].count = response.data.unfinished
      statisticsCards.value[2].count = response.data.finished
    }
  } catch (error) {
    console.error('获取统计数据失败：', error)
  }
}

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
      (card.count / statisticsCards.value[0].count * 100).toFixed(0) :
      (card.count / statisticsCards.value[0].count * 100).toFixed(0)
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
          color: card.id === 2 ? '#F87171' : '#10B981',
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
              color: card.id === 2 ? '#F87171' : '#10B981'
            }
          },
          {
            value: statisticsCards.value[0].count - card.count,
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

// 任务数据和加载状态
const tasks = ref([])
const isTasksLoading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = 5
const totalCount = ref(0)

// 分页后的任务列表
const paginatedTasks = computed(() => {
  return tasks.value
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / pageSize)
})

// 获取优先级样式类
const getPriorityClass = (priority) => {
  const classes = {
    1: 'bg-red-100 text-red-800',     // P1 - 红色
    2: 'bg-yellow-100 text-yellow-800', // P2 - 黄色
    3: 'bg-green-100 text-green-800',   // P3 - 绿色
    4: 'bg-blue-100 text-blue-800'      // P4 - 蓝色
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

// 获取优先级标签
const getPriorityLabel = (priority) => {
  const priorityLabels = {
    1: 'P1',
    2: 'P2',
    3: 'P3',
    4: 'P4'
  }
  return priorityLabels[priority] || '未设置'
}

// 加载任务数据
const loadTasks = async () => {
  isTasksLoading.value = true
  try {
    const filterParam = activeFilter.value === 'today' ?
      {
        startDate: dayjs().format('YYYY-MM-DD 00:00:00'),
        endDate: dayjs().format('YYYY-MM-DD 23:59:59'),
        status: 'wait,todo,in_progress'
      } :
      {
        startDate: dayjs().startOf('week').format('YYYY-MM-DD 00:00:00'),
        endDate: dayjs().endOf('week').format('YYYY-MM-DD 23:59:59'),
        status: 'wait,todo,in_progress'
      }
    const res = await fetchTasks({
      current: currentPage.value,
      size: pageSize,
      ...filterParam
    })
    if (res.success) {
      tasks.value = res.data
      totalCount.value = res.total
    }
  } catch (error) {
    console.error('加载任务列表失败：', error)
  } finally {
    isTasksLoading.value = false
  }
}

// 加载三状态任务列表数据
const loadTaskColumns = async () => {
  try {
    const res = await fetchTasks({
      current: 1,
      size: 999, // 获取所有任务
      startDate: dayjs().format('YYYY-MM-DD 00:00:00'),
      endDate: dayjs().format('YYYY-MM-DD 23:59:59')
    })
    if (res.success) {
      // 清空现有数据
      taskColumns.value.forEach(column => {
        column.tasks = []
      })

      // 根据任务状态分类
      res.data.forEach(task => {
        if (['todo', 'wait'].includes(task.status)) {
          taskColumns.value[0].tasks.push({
            id: task.id,
            name: task.taskName,
            project: task.projectName,
            date: task.endTime
          })
        } else if (task.status === 'in_progress') {
          taskColumns.value[1].tasks.push({
            id: task.id,
            name: task.taskName,
            project: task.projectName,
            date: task.endTime
          })
        } else if (task.status === 'completed') {
          taskColumns.value[2].tasks.push({
            id: task.id,
            name: task.taskName,
            project: task.projectName,
            date: task.endTime
          })
        }
      })
    }
  } catch (error) {
    console.error('加载三状态任务列表失败：', error)
  }
}

// 监听筛选条件和页码变化，重新加载数据
watch([activeFilter, currentPage], () => {
  loadTasks()
})

// 时间线事件数据
const timelineEvents = ref([])

// 加载时间线事件数据
const loadTimelineEvents = async () => {
  try {
    const res = await fetchTasks({
      current: 1,
      size: 999,
      startDate: dayjs().format('YYYY-MM-DD 00:00:00'),
      endDate: dayjs().format('YYYY-MM-DD 23:59:59'),
      status: 'completed'
    })
    if (res.success) {
      timelineEvents.value = res.data.map(task => ({
        task: task.taskName,
        time: dayjs(task.completionTime).format('HH:mm')
      }))
    }
  } catch (error) {
    console.error('加载时间线事件失败：', error)
  }
}

// 任务操作处理函数更新后重新加载数据
const handleTaskAction = async (task, action) => {
  const actionMap = {
    start: { status: 'in_progress', message: '任务已开始' },
    pause: { status: 'wait', message: '任务已暂停' },
    complete: { status: 'completed', message: '任务已完成' },
    deprecate: { status: 'deprecated', message: '任务已废弃' },
    delay: { status: 'wait', message: '任务已延期' }
  }

  const { status, message } = actionMap[action]
  task.status = status

  try {
    // 如果是延期，入参传入其他的
    if (action === 'delay') {
      // 计算延期后的日期 task.endTime 往后延期一天
      const newDate = dayjs(task.endTime).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      console.log('------newDate' + newDate)
      task.endTime = newDate
      const res = await updateTask({ taskId: task.taskId, status: status, endTime: newDate })
      if (res.success) {
        toast.show('success', message)
      } else {
        toast.show('error', res.errorMessage || '操作失败')
      }
    } else {
      const res = await updateTask({ taskId: task.taskId, status: status })
      if (res.success) {
        console.log(res)
        toast.show('success', message)
      } else {
        toast.show('error', res.errorMessage || '操作失败')
      }
    }
    // 重新加载任务列表和三状态任务列表
    loadTasks()
    loadTaskColumns()
    // 如果是完成任务，刷新时间线数据
    if (action === 'complete') {
      loadTimelineEvents()
    }
  } catch (error) {
    console.error('更新任务状态失败：', error)
  }
}

// 三状态任务列表数据
const taskColumns = ref([
  {
    id: 'todo',
    title: '待处理',
    tasks: []
  },
  {
    id: 'in_progress',
    title: '进行中',
    tasks: []
  },
  {
    id: 'done',
    title: '已完成',
    tasks: []
  }
])

// 热力图数据
const heatmapData = ref([])
const monthEndDate = ref(dayjs().endOf('month').format('YYYY-MM-DD'))

// 视图模式切换
const viewMode = ref('year')
const currentMonth = ref(new Date())
const monthHeatmapData = ref([])
const monthDataMax = ref(0)

// 加载热力图数据
const loadHeatmapData = async () => {
  try {
    const startDate = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00')
    const endDate = dayjs().endOf('month').format('YYYY-MM-DD 23:59:59')

    const res = await fetchTasks({
      current: 1,
      size: 999,
      startDate,
      endDate
    })

    if (res.success) {
      // 按日期分组统计任务数量
      const taskCountMap = {}
      res.data.forEach(task => {
        const date = dayjs(task.endTime).format('YYYY-MM-DD')
        taskCountMap[date] = (taskCountMap[date] || 0) + 1
      })
      // 生成完整当月日期数据（包含零值）
      const daysInMonth = dayjs().daysInMonth()
      const heatmapDataArray = []
      for (let i = 0; i < daysInMonth; i++) {
        const date = dayjs().startOf('month').add(i, 'day').format('YYYY-MM-DD')
        heatmapDataArray.push({
          date,
          count: taskCountMap[date] || 0
        })
      }

      heatmapData.value = heatmapDataArray

      // 设置月视图数据
      monthHeatmapData.value = heatmapDataArray
      monthDataMax.value = Math.max(...heatmapDataArray.map(d => d.count), 1)
    }
  } catch (error) {
    console.error('加载热力图数据失败：', error)
  }
}

// 在页面加载时获取热力图数据
onMounted(() => {
  loadTasks()
  loadTaskColumns()
  loadTimelineEvents()
  fetchStatistics()
  loadHeatmapData()
  
  // 监听任务更新事件，刷新看板数据
  eventBus.on('task-updated', () => {
    loadTasks()
    loadTaskColumns()
    loadTimelineEvents()
    fetchStatistics()
    loadHeatmapData()
  })
})
</script>