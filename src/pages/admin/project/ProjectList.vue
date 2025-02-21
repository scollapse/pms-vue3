<template>
    <div class="p-4 bg-white rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
            <button @click="$emit('add-project')"
                class="px-4 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700">新增项目</button>
        </div>

        <!-- 加载效果 -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>

        <table v-else class="min-w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-2 text-left text-gray-600">项目名称</th>
                    <th class="px-4 py-2 text-left text-gray-600">负责人</th>
                    <th class="px-4 py-2 text-left text-gray-600">状态</th>
                    <th class="px-4 py-2 text-left text-gray-600">优先级</th>
                    <th class="px-4 py-2 text-left text-gray-600">开始时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">截止时间</th>
                    <th class="px-4 py-2 text-left text-gray-600">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in projects" :key="project.projectId" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100">
                    <td class="px-4 py-2">{{ project.projectName }}</td>
                    <td class="px-4 py-2">{{ project.ownerName }}</td>
                    <td class="px-4 py-2">
                        <el-tag :type="getStatusType(project.status)">{{ project.status }}</el-tag>
                    </td>
                    <td class="px-4 py-2">
                        <el-tag :type="getPriorityType(project.priority)">{{ getPriorityLabel(project.priority) }}</el-tag>
                    </td>
                    <td class="px-4 py-2">{{ formatDate(project.startTime) }}</td>
                    <td class="px-4 py-2">{{ formatDate(project.endTime) }}</td>
                    <td class="px-4 py-2 space-x-2">
                        <button @click="$emit('edit-project', project.projectId)"
                            class="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">编辑</button>
                        <button @click="$emit('delete-project', project.projectId)"
                            class="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">删除</button>
                    </td>
                </tr>
                <tr v-if="projects.length === 0">
                    <td colspan="7" class="px-4 py-2 text-center text-gray-500">暂无数据</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    projects: {
        type: Array,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const getStatusType = (status) => {
    const types = {
        '未开始': 'info',
        '进行中': 'warning',
        '已完成': 'success',
        '已暂停': 'danger'
    }
    return types[status] || 'info'
}

const getPriorityType = (priority) => {
    const types = {
        1: 'danger',
        2: 'warning',
        3: 'info'
    }
    return types[priority] || 'info'
}

const getPriorityLabel = (priority) => {
    const labels = {
        1: '高',
        2: '中',
        3: '低'
    }
    return labels[priority] || '未知'
}

const formatDate = (date) => {
    if (!date) return '未设置'
    return new Date(date).toLocaleDateString()
}
</script>
