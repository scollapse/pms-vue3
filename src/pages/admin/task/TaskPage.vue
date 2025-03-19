<template>
    <div class="bg-indigo-50 rounded-lg p-4 h-screen flex">
        <div class="flex-grow overflow-hidden">
            <!-- Tabs 组件 -->
            <div class="mb-4 border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li class="mr-2" role="presentation">
                        <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="[
                            activeTab === 'board'
                                ? 'text-blue-500 border-blue-500'
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]" @click="activeTab = 'board'" role="tab">
                            任务看板
                        </button>
                    </li>
                    <li class="mr-2" role="presentation">
                        <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="[
                            activeTab === 'task'
                                ? 'text-blue-500 border-blue-500'
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]" @click="activeTab = 'task'" role="tab">
                            任务管理
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Tab 内容 -->
            <div class="tab-content overflow-auto">
                <div v-show="activeTab === 'board'" role="tabpanel" class="flex">
                    <div class="flex-grow overflow-auto min-h-[600px]">
                        <TaskBoard />
                    </div>
                </div>
                <div v-show="activeTab === 'task'" role="tabpanel" class="flex">
                    <div class="flex-grow flex flex-col">
                        <div class="flex-grow overflow-auto min-h-[600px]">
                            <TaskList :tasks="tasks" :is-loading="isTaskLoading"
                                :project-options="projectOptions"
                                @edit-task="showEditTaskDialog" @delete-task="handleDeleteTask" 
                                @refresh="refreshTaskList" @status-change="handleTaskStatusChange"
                                @view-mode-change="handleTaskViewModeChange" />
                        </div>
                        <pagination style="margin-top: 10px;" :load-data="loadTasks" :filters="taskFilters"
                            :size="taskSize" ref="taskPagination" />
                    </div>
                    <!-- 任务表单 -->
                    <div class="w-1/4 ml-4 transition-all duration-300 ease-in-out min-h-[600px]">
                        <TaskForm
                            :task-data="taskForm"
                            :project-options="projectOptions"
                            :form-mode="taskFormMode"
                            :is-loading="isConfirmLoading"
                            @submit="handleTaskSubmit"
                            @cancel="clearTaskForm"
                        />
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import TaskList from './TaskList.vue'
import TaskForm from './TaskForm.vue'
import TaskBoard from './TaskBoard.vue'
import Pagination from '@/components/Pagination.vue'
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/admin/task'
import { fetchProjects } from '@/api/admin/project'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'
import eventBus from '@/composables/utils/eventBus'
import '@/assets/styles/form.css'

const activeTab = ref('board')
const tasks = ref([])
const isTaskLoading = ref(false)
const isConfirmLoading = ref(false)
const taskPagination = ref(null)
const taskFilters = ref({})

// 定义任务的分页大小
const taskSize = ref(10) // 默认列表视图大小

// 处理任务状态变更
const handleTaskStatusChange = (status) => {
    if (status === 'all') {
        delete taskFilters.value.status
    } else {
        taskFilters.value.status = status
    }
    refreshTaskList()
}

// 处理任务视图模式变化
const handleTaskViewModeChange = (size) => {
    taskSize.value = size
}

// 表单相关
const taskFormMode = ref('add')
const taskFormTitle = ref('新增任务')

const taskForm = ref({
    taskName: '',
    projectId: '',
    priority: '4',
    estimateHours: 0,
    startTime: null,
    endTime: null,
    tags: []  // 标签数组，格式：[{id: number, name: string}]
})

const projectOptions = ref([])

// 添加任务表单错误状态
const taskFormErrors = ref({
    taskName: '',
    priority: '',
    dateRange: ''
})

// 加载数据方法
const loadTasks = async (currentPage, pageSize, filters, setTotal) => {
    isTaskLoading.value = true
    try {
        const res = await fetchTasks({
            current: currentPage,
            size: pageSize,
            ...filters
        })
        if (res.success) {
            tasks.value = res.data
            setTotal(res.total)
        }
    } catch (error) {
        console.error('Failed to fetch tasks:', error)
        toast.show('error', '加载任务列表失败')
    } finally {
        isTaskLoading.value = false
    }
}

// 加载项目选项
const loadProjectOptions = async () => {
    try {
        const res = await fetchProjects({
            current: 1,
            size: 999,  // 获取所有项目作为选项
            status: 'in_progress' 
        })
        if (res.success) {
            projectOptions.value = [
                { projectId: '-1', projectName: '无' }, // 默认选项
                ...res.data.map(p => ({
                    projectId: p.projectId,
                    projectName: p.projectName
                }))
            ]
        }
    } catch (error) {
        console.error('Failed to fetch project options:', error)
        toast.show('error', '加载项目选项失败')
    }
}

// 任务相关方法
const showEditTaskDialog = async (taskId) => {
    taskFormMode.value = 'edit'
    const task = tasks.value.find(t => t.taskId === taskId)
    if (task) {
        taskForm.value = { ...task }
    }
}
// 清空表单
const clearTaskForm = () => {
    taskFormMode.value = 'add'
    taskForm.value = {
        taskName: '',
        projectId: '',
        priority: '4',
        estimateHours: 0,
        startTime: null,
        endTime: null,
        tags: []  // 清空标签
    }
    taskFormErrors.value = {
        taskName: '',
        priority: '',
        dateRange: ''
    }
}

// 任务提交
const handleTaskSubmit = async (formData) => {
    isConfirmLoading.value = true
    try {
        const api = taskFormMode.value === 'add' ? addTask : updateTask
        const res = await api(formData)
        if (res.success) {
            toast.show('success', `${taskFormMode.value === 'add' ? '新增' : '编辑'}任务成功`)
            refreshTaskList()
            
            // 如果是新增，清空表单；如果是编辑，保持当前数据
            if (taskFormMode.value === 'add') {
                clearTaskForm()
            } else {
                // 更新当前表单数据为最新数据
                const updatedTask = await fetchTasks({
                    taskId: formData.taskId
                })
                if (updatedTask.success && updatedTask.data.length > 0) {
                    taskForm.value = { ...updatedTask.data[0] }
                }
            }
            
            // 检查是否有新标签
            const hasNewTags = formData.tags.some(tag => !tag.id)
            // 如果有新标签，发送更新事件
            if (hasNewTags) {
                eventBus.emit('tags-updated')
            }
            // 通过事件总线通知TaskBoard组件刷新数据
            eventBus.emit('task-updated', formData.projectId)
        } else {
            toast.show('error', res.errorMessage || '操作失败')
        }
    } catch (error) {
        console.error('Failed to submit task:', error)
        toast.show('error', `${taskFormMode.value === 'add' ? '新增' : '编辑'}任务失败`)
    } finally {
        isConfirmLoading.value = false
    }
}

// 删除任务
const handleDeleteTask = (taskId, projectId) => {
    modal.showConfirm('确定要删除该任务吗？', async () => {
        try {
            const res = await deleteTask({ taskId })
            if (res.success) {
                toast.show('success', '删除任务成功')
                refreshTaskList()
                // 通过事件总线通知TaskBoard组件刷新数据
                eventBus.emit('task-updated', projectId)
            } else {
                toast.show('error', res.errorMessage)
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
            toast.show('error', '删除任务失败')
        }
    })
}

// 刷新列表
const refreshTaskList = (filters = {}) => {
    if (taskPagination.value) {
        // 使用新对象替换整个 taskFilters，确保所有属性都被正确更新
        taskFilters.value = { ...taskFilters.value, ...filters }
        console.log('taskFilters.value', taskFilters.value)
        // 使用最新的 taskFilters 进行查询
        taskPagination.value.refresh({ ...taskFilters.value })
    }
}

// 添加表单字段监听，清除对应错误提示
watch(() => taskForm.value.taskName, () => {
    taskFormErrors.value.taskName = ''
})

watch(() => taskForm.value.priority, () => {
    taskFormErrors.value.priority = ''
})

watch([
    () => taskForm.value.startTime,
    () => taskForm.value.endTime
], () => {
    taskFormErrors.value.dateRange = ''
})

// 初始化加载数据
onMounted(async () => {
    // 加载任务列表
    if (taskPagination.value) {
        await taskPagination.value.refresh()
    }

    // 初始加载项目选项
    await loadProjectOptions()
    
    // 监听项目选项更新事件
    eventBus.on('project-options-updated', (data) => {
        projectOptions.value = [
            { projectId: '-1', projectName: '无' }, // 默认选项
            ...data.map(p => ({
                projectId: p.projectId,
                projectName: p.projectName
            }))
        ]
    })
})

// 添加组件卸载时的清理逻辑
onUnmounted(() => {
    // 移除事件监听器
    eventBus.off('task-updated')
    eventBus.off('project-options-updated')
})

watch(() => activeTab.value, (newTab) => {
    if (newTab === 'task' && taskPagination.value) {
        taskPagination.value.refresh()
        // 切换到任务管理标签时，重置为新增模式
        taskFormMode.value = 'add'
        clearTaskForm()
    }
})
</script>
