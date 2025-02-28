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
                    <th class="px-4 py-2 text-left text-gray-600">状态</th>
                    <th class="px-4 py-2 text-left text-gray-600">优先级</th>
                    <th class="px-4 py-2 text-left text-gray-600">标签</th>
                    <th class="px-4 py-2 text-left text-gray-600">预计工时</th>
                    <th class="px-4 py-2 text-left text-gray-600">开始时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">截止时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">完成时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.taskId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100">
                    <td class="px-4 py-2">{{ task.taskName }}</td>
                    <td class="px-4 py-2">{{ task.projectName }}</td>
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
                    <td class="px-4 py-2">
                        <div class="flex flex-wrap gap-1">
                            <el-tag v-for="tag in task.tags" :key="tag.id" size="small" class="mr-1">
                                {{ tag.name }}
                            </el-tag>
                            <span v-if="!task.tags || task.tags.length === 0" class="text-gray-400 text-xs">无标签</span>
                        </div>
                    </td>
                    <td class="px-4 py-2">{{ task.estimateHours }}h</td>
                    <td class="px-4 py-2">{{ formatDate(task.startTime) }}</td>
                    <td class="px-4 py-2">{{ formatDate(task.endTime) }}</td>
                    <td class="px-4 py-2">{{ formatDate(task.completionTime) }}</td>
                    <td class="px-4 py-2">
                        <div class="flex items-center gap-2">
                            <!-- 编辑按钮 -->
                            <button v-if="['todo', 'in_progress', 'wait'].includes(task.status)" 
                                @click="$emit('edit-task', task.taskId)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:ring-4 focus:ring-blue-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                编辑
                            </button>
                            
                            <!-- 开始按钮：todo或wait状态时显示 -->
                            <button v-if="['todo', 'wait'].includes(task.status)"
                                @click="handleStartTask(task)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-green-700 bg-green-100 rounded-lg hover:bg-green-200 focus:ring-4 focus:ring-green-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                开始
                            </button>
                            
                            <!-- 暂停按钮：进行中状态时显示 -->
                            <button v-if="task.status === 'in_progress'"
                                @click="handlePauseTask(task)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 focus:ring-4 focus:ring-yellow-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                暂停
                            </button>
                            
                            <!-- 完成按钮：进行中状态时显示 -->
                            <button v-if="task.status === 'in_progress'"
                                @click="handleFinishTask(task)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-green-700 bg-green-100 rounded-lg hover:bg-green-200 focus:ring-4 focus:ring-green-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                完成
                            </button>
                            
                            <!-- 废弃按钮：todo或in_progress状态时显示 -->
                            <button v-if="['todo', 'in_progress'].includes(task.status)"
                                @click="handleDeprecateTask(task)"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-100">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                废弃
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
                    <td colspan="10" class="px-4 py-2 text-center text-gray-500">暂无数据</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { updateTask } from '@/api/admin/task'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'

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

const emit = defineEmits(['add-task', 'edit-task', 'delete-task', 'refresh'])

const getStatusType = (status) => {
    const types = {
        'todo': 'info',
        'in_progress': 'warning',
        'completed': 'success',
        'wait': 'default',
        'deprecated': 'danger'
    }
    return types[status] || 'info'
}

const getStatusLabel = (status) => {
    const labels = {
        'todo': '待处理',
        'in_progress': '进行中',
        'completed': '已完成',
        'wait': '已暂停',
        'deprecated': '已废弃'
    }
    return labels[status] || status
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

// 开始任务
const handleStartTask = (task) => {
    modal.showConfirm('确定要开始该任务吗？', async () => {
        try {
            const res = await updateTask({
                taskId: task.taskId,
                status: 'in_progress'
            })
            if (res.success) {
                toast.show('success', '任务已开始')
                emit('refresh')
            } else {
                toast.show('error', res.errorMessage || '操作失败')
            }
        } catch (error) {
            console.error('Failed to start task:', error)
            toast.show('error', '操作失败')
        }
    })
}

// 暂停任务
const handlePauseTask = (task) => {
    modal.showConfirm('确定要暂停该任务吗？', async () => {
        try {
            const res = await updateTask({
                taskId: task.taskId,
                status: 'wait'
            })
            if (res.success) {
                toast.show('success', '任务已暂停')
                emit('refresh')
            } else {
                toast.show('error', res.errorMessage || '操作失败')
            }
        } catch (error) {
            console.error('Failed to pause task:', error)
            toast.show('error', '操作失败')
        }
    })
}

// 完成任务
const handleFinishTask = (task) => {
    modal.showConfirm('确定要完成该任务吗？', async () => {
        try {
            const res = await updateTask({
                taskId: task.taskId,
                status: 'completed'
            })
            if (res.success) {
                toast.show('success', '任务已完成')
                emit('refresh')
            } else {
                toast.show('error', res.errorMessage || '操作失败')
            }
        } catch (error) {
            console.error('Failed to finish task:', error)
            toast.show('error', '操作失败')
        }
    })
}

// 废弃任务
const handleDeprecateTask = (task) => {
    modal.showConfirm('确定要废弃该任务吗？', async () => {
        try {
            const res = await updateTask({
                taskId: task.taskId,
                status: 'deprecated'
            })
            if (res.success) {
                toast.show('success', '任务已废弃')
                emit('refresh')
            } else {
                toast.show('error', res.errorMessage || '操作失败')
            }
        } catch (error) {
            console.error('Failed to deprecate task:', error)
            toast.show('error', '操作失败')
        }
    })
}
</script>
