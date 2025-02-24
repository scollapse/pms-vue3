<template>
    <div class="p-4 bg-white rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
            <button @click="$emit('add-task')"
                class="px-4 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700">新增任务</button>
        </div>

        <!-- 加载效果 -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <table v-else class="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-2 text-left text-gray-600">任务名称</th>
                    <th class="px-4 py-2 text-left text-gray-600">所属项目</th>
                    <th class="px-4 py-2 text-left text-gray-600">负责人</th>
                    <th class="px-4 py-2 text-left text-gray-600">状态</th>
                    <th class="px-4 py-2 text-left text-gray-600">优先级</th>
                    <th class="px-4 py-2 text-left text-gray-600">预计工时</th>
                    <th class="px-4 py-2 text-left text-gray-600">开始时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">截止时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.taskId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100">
                    <td class="px-4 py-2">{{ task.taskName }}</td>
                    <td class="px-4 py-2">{{ task.projectName }}</td>
                    <td class="px-4 py-2">{{ task.ownerName }}</td>
                    <td class="px-4 py-2">
                        <el-tag :type="getStatusType(task.status)">{{ getStatusLabel(task.status) }}</el-tag>
                    </td>
                    <td class="px-4 py-2">
                        <span :class="[
                            'px-2 py-1 rounded-md text-xs font-medium',
                            getPriorityType(task.priority)
                        ]">
                            {{ getPriorityLabel(task.priority) }}
                        </span>
                    </td>
                    <td class="px-4 py-2">{{ task.estimateHours }}h</td>
                    <td class="px-4 py-2">{{ formatDate(task.startTime) }}</td>
                    <td class="px-4 py-2">{{ formatDate(task.endTime) }}</td>
                    <td class="px-4 py-2">
                        <div class="flex items-center gap-2">
                            <!-- 编辑按钮 -->
                            <button @click="$emit('edit-task', task.taskId)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:ring-4 focus:ring-blue-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                编辑
                            </button>
                            
                            <!-- 完成按钮 -->
                            <button 
                                v-if="task.status !== 'completed'"
                                @click="handleFinishTask(task.taskId)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-green-700 bg-green-100 rounded-lg hover:bg-green-200 focus:ring-4 focus:ring-green-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                完成
                            </button>

                            <!-- 删除按钮 -->
                            <button @click="$emit('delete-task', task.taskId)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-red-700 bg-red-100 rounded-lg hover:bg-red-200 focus:ring-4 focus:ring-red-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                删除
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="tasks.length === 0">
                    <td colspan="9" class="px-4 py-2 text-center text-gray-500">暂无数据</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import modal from '@/composables/utils/modal'
import toast from '@/composables/utils/toast'
import { finishTask } from '@/api/admin/task'

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['edit-task', 'delete-task', 'refresh'])

const getStatusType = (status) => {
    const types = {
        'backlog': 'info',
        'todo': 'info',
        'in_progress': 'warning',
        'review': 'danger',
        'completed': 'success'
    }
    return types[status] || 'info'
}

const getPriorityType = (priority) => {
    const types = {
        1: 'bg-red-100 text-red-800',     // P1 - 红色
        2: 'bg-yellow-100 text-yellow-800', // P2 - 黄色
        3: 'bg-green-100 text-green-800',   // P3 - 绿色
        4: 'bg-blue-100 text-blue-800'      // P4 - 蓝色
    }
    return types[priority] || 'bg-gray-100 text-gray-800'
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

const getStatusLabel = (status) => {
    const labels = {
        'backlog': '待办',
        'todo': '待处理',
        'in_progress': '进行中',
        'review': '评审中',
        'completed': '已完成'
    }
    return labels[status] || status
}

const formatDate = (date) => {
    if (!date) return '未设置'
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 添加完成任务的处理方法
const handleFinishTask = (taskId) => {
    modal.showConfirm('确定要完成该任务吗？', async () => {
        try {
            const res = await finishTask({ taskId })
            if (res.success) {
                toast.show('success', '任务已完成')
                emit('refresh')  // 刷新列表
            } else {
                toast.show('error', res.errorMessage || '操作失败')
            }
        } catch (error) {
            console.error('Failed to finish task:', error)
            toast.show('error', '操作失败')
        }
    })
}
</script>
