<template>
    <div class="bg-indigo-50 rounded-lg p-4 h-screen flex">
        <div class="flex-grow overflow-hidden">
            <!-- Tabs 组件 -->
            <div class="mb-4 border-b border-gray-200">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li class="mr-2" role="presentation">
                        <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="[
                            activeTab === 'task'
                                ? 'text-blue-500 border-blue-500'
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]" @click="activeTab = 'task'" role="tab">
                            任务管理
                        </button>
                    </li>
                    <li class="mr-2" role="presentation">
                        <button class="inline-block p-4 border-b-2 rounded-t-lg" :class="[
                            activeTab === 'project'
                                ? 'text-blue-500 border-blue-500'
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]" @click="activeTab = 'project'" role="tab">
                            项目管理
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Tab 内容 -->
            <div class="tab-content overflow-auto">
                <div v-show="activeTab === 'task'" role="tabpanel" class="flex">
                    <div class="flex-grow flex flex-col">
                        <div class="flex-grow overflow-auto min-h-[600px]">
                            <TaskList :tasks="tasks" :is-loading="isTaskLoading"
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
                <div v-show="activeTab === 'project'" role="tabpanel" class="flex">
                    <div class="flex-grow flex flex-col">
                        <div class="flex-grow overflow-auto min-h-[600px]">
                            <ProjectList :projects="projects" :is-loading="isProjectLoading"
                                @edit-project="showEditProjectDialog" @delete-project="handleDeleteProject"
                                @refresh="refreshProjectList" @status-change="handleStatusChange"
                                @view-mode-change="handleProjectViewModeChange"
                                @project-options-update="loadProjectOptions" />
                        </div>
                        <pagination style="margin-top: 10px;" :load-data="loadProjects" :filters="projectFilters"
                            :size="projectSize" ref="projectPagination" />
                    </div>
                    <!-- 项目表单 -->
                    <div class="w-1/4 ml-4 transition-all duration-300 ease-in-out min-h-[600px]">
                        <ProjectForm
                            :project-data="projectForm"
                            :form-mode="projectFormMode"
                            :is-loading="isConfirmLoading"
                            @submit="handleProjectSubmit"
                            @cancel="clearProjectForm"
                        />
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, watch, onMounted,onUnmounted } from 'vue'
import TaskList from './TaskList.vue'
import ProjectList from './ProjectList.vue'
import ProjectForm from './ProjectForm.vue'
import TaskForm from './TaskForm.vue'
import Pagination from '@/components/Pagination.vue'
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/admin/task'
import { fetchProjects, addProject, updateProject, deleteProject } from '@/api/admin/project'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'
import eventBus from '@/composables/utils/eventBus'
import '@/assets/styles/form.css'

const activeTab = ref('task')
const tasks = ref([])
const projects = ref([])
const isTaskLoading = ref(false)
const isProjectLoading = ref(false)
const isConfirmLoading = ref(false)
const taskModal = ref(null)
const projectModal = ref(null)
const taskPagination = ref(null)
const projectPagination = ref(null)
const taskFilters = ref({})
const projectFilters = ref({})

// 定义任务和项目的分页大小
const taskSize = ref(10) // 默认列表视图大小
const projectSize = ref(10) // 默认列表视图大小

// 处理项目状态变更
const handleStatusChange = (status) => {
    if (status === 'all') {
        delete projectFilters.value.status
    } else {
        projectFilters.value.status = status
    }
    refreshProjectList()
}

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

// 处理项目视图模式变化
const handleProjectViewModeChange = (size) => {
    projectSize.value = size
}

// 表单相关
const taskFormMode = ref('add')
const projectFormMode = ref('add')
const taskFormTitle = ref('新增任务')
const projectFormTitle = ref('新增项目')

const taskForm = ref({
    taskName: '',
    projectId: '',
    priority: '4',
    estimateHours: 0,
    startTime: null,
    endTime: null,
    tags: []  // 标签数组，格式：[{id: number, name: string}]
})

const projectForm = ref({
    projectName: '',
    priority: '4',
    description: '',
    startTime: null,
    endTime: null
})

const projectOptions = ref([])

// 添加表单错误状态
const projectFormErrors = ref({
    projectName: '',
    priority: '',
    dateRange: ''
})

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

const loadProjects = async (currentPage, pageSize, filters, setTotal) => {
    isProjectLoading.value = true
    try {
        const res = await fetchProjects({
            current: currentPage,
            size: pageSize,
            ...filters
        })
        if (res.success) {
            projects.value = res.data
            setTotal(res.total)
        }
    } catch (error) {
        console.error('Failed to fetch projects:', error)
        toast.show('error', '加载项目列表失败')
    } finally {
        isProjectLoading.value = false
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
                { projectId: '', projectName: '无' }, // 默认选项
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
            //
            // 检查是否有新标签
            const hasNewTags = formData.tags.some(tag => !tag.id)
            // 如果有新标签，发送更新事件
            if (hasNewTags) {
                eventBus.emit('tags-updated')
            }
            // 通过事件总线通知TaskBoard组件刷新数据
            eventBus.emit('task-updated')
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
const handleDeleteTask = (taskId) => {
    modal.showConfirm('确定要删除该任务吗？', async () => {
        try {
            const res = await deleteTask({ taskId })
            if (res.success) {
                toast.show('success', '删除任务成功')
                refreshTaskList()
                // 通过事件总线通知TaskBoard组件刷新数据
                eventBus.emit('task-updated')
            } else {
                toast.show('error', res.errorMessage)
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
            toast.show('error', '删除任务失败')
        }
    })
}

// 项目相关方法
const showEditProjectDialog = async (projectId) => {
    projectFormMode.value = 'edit'
    const project = projects.value.find(p => p.projectId === projectId)
    if (project) {
        projectForm.value = { ...project }
    }
}

const handleProjectSubmit = async (formData) => {
    isConfirmLoading.value = true
    try {
        const api = projectFormMode.value === 'add' ? addProject : updateProject
        const res = await api(formData)
        if (res.success) {
            toast.show('success', `${projectFormMode.value === 'add' ? '新增' : '编辑'}项目成功`)
            refreshProjectList()
            
            // 如果是新增，清空表单；如果是编辑，保持当前数据
            if (projectFormMode.value === 'add') {
                clearProjectForm()
            } else {
                // 更新当前表单数据为最新数据
                const updatedProject = await fetchProjects({
                    projectId: formData.projectId
                })
                if (updatedProject.success && updatedProject.data.length > 0) {
                    projectForm.value = { ...updatedProject.data[0] }
                }
            }
            
            // 通过事件总线通知TaskBoard组件刷新数据
            eventBus.emit('task-updated')
        } else {
            toast.show('error', res.errorMessage || '操作失败')
        }
    } catch (error) {
        console.error('Failed to submit project:', error)
        toast.show('error', `${projectFormMode.value === 'add' ? '新增' : '编辑'}项目失败`)
    } finally {
        isConfirmLoading.value = false
    }
}

const handleDeleteProject = (projectId) => {
    modal.showConfirm('确定要删除该项目吗？', async () => {
        try {
            const res = await deleteProject({ projectId })
            if (res.success) {
                toast.show('success', '删除项目成功')
                refreshProjectList()
                // 通过事件总线通知TaskBoard组件刷新数据
                eventBus.emit('task-updated')
            } else {
                toast.show('error', res.errorMessage || '删除失败')
            }
        } catch (error) {
            console.error('Failed to delete project:', error)
            toast.show('error', '删除项目失败')
        }
    })
}

// 刷新列表
const refreshTaskList = () => {
    if (taskPagination.value) {
        taskPagination.value.refresh(taskFilters.value)
    }
}

const refreshProjectList = () => {
    if (projectPagination.value) {
        projectPagination.value.refresh(projectFilters.value)
    }
}

const clearProjectForm = (mode = 'add') => {
    projectForm.value = {
        projectName: '',
        priority: '4',
        description: '',
        startTime: null,
        endTime: null
    }
    projectFormErrors.value = {
        projectName: '',
        priority: '',
        dateRange: ''
    }
    // 重置为指定模式，默认为新增模式
    projectFormMode.value = mode
}

// 监听表单字段变化，清除对应错误提示
watch(() => projectForm.value.projectName, () => {
    projectFormErrors.value.projectName = ''
})

watch(() => projectForm.value.priority, () => {
    projectFormErrors.value.priority = ''
})


// 监听日期范围变化
watch([
    () => projectForm.value.startTime,
    () => projectForm.value.endTime
], () => {
    projectFormErrors.value.dateRange = ''
})

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
    // 加载项目列表
    if (projectPagination.value) {
        await projectPagination.value.refresh()
    }

    // 加载任务列表
    if (taskPagination.value) {
        await taskPagination.value.refresh()
    }

    // 初始加载项目选项
    await loadProjectOptions()
})

// 添加组件挂载时的事件监听器
onMounted(() => {
    // 监听任务更新事件
    eventBus.on('project-task-updated', () => {
        refreshTaskList()
    })
})

// 添加组件卸载时的清理逻辑
onUnmounted(() => {
    // 移除事件监听器
    eventBus.off('project-task-updated')
})

// 重命名为 resetProjectForm 以避免重复声明
const resetProjectForm = () => {
watch(() => activeTab.value, (newTab) => {
    if (newTab === 'project' && projectPagination.value) {
        projectPagination.value.refresh()
        // 切换到项目管理标签时，重置为新增模式
        projectFormMode.value = 'add'
        clearProjectForm()
    } else if (newTab === 'task' && taskPagination.value) {
        taskPagination.value.refresh()
    }
})
}
</script>
