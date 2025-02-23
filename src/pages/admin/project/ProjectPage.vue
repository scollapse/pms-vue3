<template>
    <div class="bg-indigo-50 rounded-lg p-4">
        <!-- Tabs 组件 -->
        <div class="mb-4 border-b border-gray-200">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                <li class="mr-2" role="presentation">
                    <button 
                        class="inline-block p-4 border-b-2 rounded-t-lg"
                        :class="[
                            activeTab === 'task' 
                                ? 'text-blue-600 border-blue-600' 
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]"
                        @click="activeTab = 'task'"
                        role="tab"
                    >
                        任务管理
                    </button>
                </li>
                <li class="mr-2" role="presentation">
                    <button 
                        class="inline-block p-4 border-b-2 rounded-t-lg"
                        :class="[
                            activeTab === 'project' 
                                ? 'text-blue-600 border-blue-600' 
                                : 'hover:text-gray-600 hover:border-gray-300 border-transparent'
                        ]"
                        @click="activeTab = 'project'"
                        role="tab"
                    >
                        项目管理
                    </button>
                </li>
            </ul>
        </div>

        <!-- Tab 内容 -->
        <div class="tab-content">
            <div v-show="activeTab === 'task'" role="tabpanel">
                <TaskList 
                    :tasks="tasks"
                    :is-loading="isTaskLoading"
                    @add-task="showAddTaskDialog"
                    @edit-task="showEditTaskDialog"
                    @delete-task="handleDeleteTask"
                    @refresh="refreshTaskList"
                />
                <pagination style="margin-top: 10px;" :load-data="loadTasks" :filters="taskFilters" ref="taskPagination" />
            </div>
            <div v-show="activeTab === 'project'" role="tabpanel">
                <ProjectList 
                    :projects="projects"
                    :is-loading="isProjectLoading"
                    @add-project="showAddProjectDialog"
                    @edit-project="showEditProjectDialog"
                    @delete-project="handleDeleteProject"
                    @refresh="refreshProjectList"
                />
                <pagination style="margin-top: 10px;"  :load-data="loadProjects" :filters="projectFilters" ref="projectPagination" />
            </div>
        </div>

        <!-- 任务表单对话框 -->
        <ModalForm 
            ref="taskModal" 
            :isLoading="isConfirmLoading"
            :title="taskFormTitle"
            :dialogWidth="'w-[600px]'"
            :confirmButtonText="taskFormMode === 'add' ? '新增' : '保存'"
            @submit="handleTaskSubmit"
            @close="clearTaskForm"
        >
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            任务名称
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="taskForm.taskName" type="text" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': taskFormErrors.taskName}"
                            placeholder="请输入任务名称">
                        <p v-if="taskFormErrors.taskName" class="text-pink-500 text-sm mt-2">{{ taskFormErrors.taskName }}</p>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">所属项目</label>
                        <select v-model="taskForm.projectId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option v-for="project in projectOptions" :key="project.projectId" :value="project.projectId">
                                {{ project.projectName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                        <select v-model="taskForm.priority"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': taskFormErrors.priority}">
                            <option value="1">P1</option>
                            <option value="2">P2</option>
                            <option value="3">P3</option>
                            <option value="4">P4</option>
                        </select>
                        <p v-if="taskFormErrors.priority" class="text-pink-500 text-sm mt-2">{{ taskFormErrors.priority }}</p>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <select v-model="taskForm.status"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': taskFormErrors.status}">
                            <option value="backlog">待办</option>
                            <option value="todo">待处理</option>
                            <option value="in_progress">进行中</option>
                            <option value="review">评审中</option>
                            <option value="completed">已完成</option>
                        </select>
                        <p v-if="taskFormErrors.status" class="text-pink-500 text-sm mt-2">{{ taskFormErrors.status }}</p>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">预计工时</label>
                        <input v-model="taskForm.estimateHours" type="number" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                        <select v-model="taskForm.ownerId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option v-for="user in userOptions" :key="user.userId" :value="user.userId">
                                {{ user.userName }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            任务周期
                            <span class="text-red-500">*</span>
                        </label>
                        <DateRangePicker
                            v-model:startDate="taskForm.startTime"
                            v-model:endDate="taskForm.endTime"
                            placeholder="请选择开始和结束时间"
                            class="mt-1 block w-full"
                            :class="{'[&>input]:border-pink-500 [&>input]:focus:border-pink-500 [&>input]:focus:ring-pink-200': taskFormErrors.dateRange}"
                        />
                        <p v-if="taskFormErrors.dateRange" class="text-pink-500 text-sm mt-2">{{ taskFormErrors.dateRange }}</p>
                    </div>
                </div>
            </div>
        </ModalForm>

        <!-- 项目表单对话框 -->
        <ModalForm 
            ref="projectModal" 
            :isLoading="isConfirmLoading"
            :title="projectFormTitle"
            :dialogWidth="'w-[600px]'"
            :confirmButtonText="projectFormMode === 'add' ? '新增' : '保存'"
            @submit="handleProjectSubmit"
            @close="clearProjectForm"
        >
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            项目名称
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="projectForm.projectName" type="text" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': projectFormErrors.projectName}"
                            placeholder="请输入项目名称">
                        <p v-if="projectFormErrors.projectName" class="text-pink-500 text-sm mt-2">{{ projectFormErrors.projectName }}</p>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                        <select v-model="projectForm.ownerId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="请选择负责人">
                            <option v-for="user in userOptions" :key="user.userId" :value="user.userId">
                                {{ user.userName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            优先级
                            <span class="text-red-500">*</span>
                        </label>
                        <select v-model="projectForm.priority"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': projectFormErrors.priority}">
                            <option value="1">P1</option>
                            <option value="2">P2</option>
                            <option value="3">P3</option>
                            <option value="4">P4</option>
                        </select>
                        <p v-if="projectFormErrors.priority" class="text-pink-500 text-sm mt-2">{{ projectFormErrors.priority }}</p>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            状态
                            <span class="text-red-500">*</span>
                        </label>
                        <select v-model="projectForm.status"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            :class="{'border-pink-500 focus:border-pink-500 focus:ring-pink-200': projectFormErrors.status}">
                            <option value="planning">规划中</option>
                            <option value="in_progress">进行中</option>
                            <option value="paused">已暂停</option>
                            <option value="completed">已完成</option>
                            <option value="archived">已归档</option>
                        </select>
                        <p v-if="projectFormErrors.status" class="text-pink-500 text-sm mt-2">{{ projectFormErrors.status }}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            项目周期
                            <span class="text-red-500">*</span>
                        </label>
                        <DateRangePicker
                            v-model:startDate="projectForm.startTime"
                            v-model:endDate="projectForm.endTime"
                            placeholder="请选择开始和结束时间"
                            class="mt-1 block w-full"
                            :class="{'[&>input]:border-pink-500 [&>input]:focus:border-pink-500 [&>input]:focus:ring-pink-200': projectFormErrors.dateRange}"
                        />
                        <p v-if="projectFormErrors.dateRange" class="text-pink-500 text-sm mt-2">{{ projectFormErrors.dateRange }}</p>
                    </div>
                </div>
                <div class="form-item">
                    <label class="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                    <textarea v-model="projectForm.description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="请输入项目描述"></textarea>
                </div>
            </div>
        </ModalForm>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TaskList from './TaskList.vue'
import ProjectList from './ProjectList.vue'
import ModalForm from '@/components/ModalForm.vue'
import Pagination from '@/components/Pagination.vue'
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/admin/task'
import { fetchProjects, addProject, updateProject, deleteProject } from '@/api/admin/project'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'
import DateRangePicker from '@/components/DateRangePicker.vue'

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

// 表单相关
const taskFormMode = ref('add')
const projectFormMode = ref('add')
const taskFormTitle = ref('新增任务')
const projectFormTitle = ref('新增项目')

const taskForm = ref({
    taskName: '',
    projectId: '',
    ownerId: '',
    status: 'planning',
    priority: '4',
    estimateHours: 0,
    startTime: null,
    endTime: null
})

const projectForm = ref({
    projectName: '',
    ownerId: '',
    status: 'planning',
    priority: '4',
    description: '',
    startTime: null,
    endTime: null
})

// 模拟数据，实际应从API获取
const userOptions = ref([
    { userId: '1', userName: '用户1' },
    { userId: '2', userName: '用户2' }
])

const projectOptions = ref([])

// 添加表单错误状态
const projectFormErrors = ref({
    projectName: '',
    priority: '',
    status: '',
    dateRange: ''
})

// 添加任务表单错误状态
const taskFormErrors = ref({
    taskName: '',
    priority: '',
    status: '',
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
        console.log("res:" + res)
        if (res.success) {
            projects.value = res.data
            setTotal(res.total)
            projectOptions.value = res.data.map(p => ({
                projectId: p.projectId,
                projectName: p.projectName
            }))
        }
    } catch (error) {
        console.error('Failed to fetch projects:', error)
        toast.show('error', '加载项目列表失败')
    } finally {
        isProjectLoading.value = false
    }
}

// 任务相关方法
const showAddTaskDialog = () => {
    taskFormMode.value = 'add'
    taskFormTitle.value = '新增任务'
    taskModal.value.openModal()
}

const showEditTaskDialog = async (taskId) => {
    taskFormMode.value = 'edit'
    taskFormTitle.value = '编辑任务'
    const task = tasks.value.find(t => t.taskId === taskId)
    if (task) {
        taskForm.value = { ...task }
        taskModal.value.openModal()
    }
}

const handleTaskSubmit = async () => {
    // 重置错误信息
    taskFormErrors.value = {
        taskName: '',
        priority: '',
        status: '',
        dateRange: ''
    }
    
    // 表单验证
    let isValid = true
    
    if (!taskForm.value.taskName?.trim()) {
        taskFormErrors.value.taskName = '请输入任务名称'
        isValid = false
    }
    
    if (!taskForm.value.priority) {
        taskFormErrors.value.priority = '请选择优先级'
        isValid = false
    }
    
    if (!taskForm.value.status) {
        taskFormErrors.value.status = '请选择状态'
        isValid = false
    }
    
    if (!taskForm.value.startTime || !taskForm.value.endTime) {
        taskFormErrors.value.dateRange = '请选择任务周期'
        isValid = false
    }
    
    if (!isValid) {
        return
    }

    isConfirmLoading.value = true
    try {
        const api = taskFormMode.value === 'add' ? addTask : updateTask
        const res = await api(taskForm.value)
        if (res.success) {
            toast.show('success', `${taskFormMode.value === 'add' ? '新增' : '编辑'}任务成功`)
            taskModal.value.closeModal()
            refreshTaskList()
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
const showAddProjectDialog = () => {
    projectFormMode.value = 'add'
    projectFormTitle.value = '新增项目'
    projectModal.value.openModal()
}

const showEditProjectDialog = async (projectId) => {
    projectFormMode.value = 'edit'
    projectFormTitle.value = '编辑项目'
    const project = projects.value.find(p => p.projectId === projectId)
    if (project) {
        projectForm.value = { ...project }
        projectModal.value.openModal()
    }
}

const handleProjectSubmit = async () => {
    // 重置错误信息
    projectFormErrors.value = {
        projectName: '',
        priority: '',
        status: '',
        dateRange: ''
    }
    
    // 表单验证
    let isValid = true
    
    if (!projectForm.value.projectName?.trim()) {
        projectFormErrors.value.projectName = '请输入项目名称'
        isValid = false
    }
    
    if (!projectForm.value.priority) {
        projectFormErrors.value.priority = '请选择优先级'
        isValid = false
    }
    
    if (!projectForm.value.status) {
        projectFormErrors.value.status = '请选择状态'
        isValid = false
    }
    
    if (!projectForm.value.startTime || !projectForm.value.endTime) {
        projectFormErrors.value.dateRange = '请选择项目周期'
        isValid = false
    }
    
    if (!isValid) {
        return
    }

    isConfirmLoading.value = true
    try {
        const api = projectFormMode.value === 'add' ? addProject : updateProject
        const res = await api(projectForm.value)
        if (res.success) {
            toast.show('success', `${projectFormMode.value === 'add' ? '新增' : '编辑'}项目成功`)
            projectModal.value.closeModal()
            refreshProjectList()
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

// 清空表单
const clearTaskForm = () => {
    taskForm.value = {
        taskName: '',
        projectId: '',
        ownerId: '',
        status: 'planning',
        priority: '4',
        estimateHours: 0,
        startTime: null,
        endTime: null
    }
    taskFormErrors.value = {
        taskName: '',
        priority: '',
        status: '',
        dateRange: ''
    }
}

const clearProjectForm = () => {
    projectForm.value = {
        projectName: '',
        ownerId: '',
        status: 'planning',
        priority: '4',
        description: '',
        startTime: null,
        endTime: null
    }
    projectFormErrors.value = {
        projectName: '',
        priority: '',
        status: '',
        dateRange: ''
    }
}

// 监听表单字段变化，清除对应错误提示
watch(() => projectForm.value.projectName, () => {
    projectFormErrors.value.projectName = ''
})

watch(() => projectForm.value.priority, () => {
    projectFormErrors.value.priority = ''
})

watch(() => projectForm.value.status, () => {
    projectFormErrors.value.status = ''
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

watch(() => taskForm.value.status, () => {
    taskFormErrors.value.status = ''
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
    
    // 加载项目选项（用于任务表单中选择所属项目）
    try {
        const res = await fetchProjects({
            current: 1,
            size: 999  // 获取所有项目作为选项
        })
        if (res.success) {
            projectOptions.value = res.data.map(p => ({
                projectId: p.projectId,
                projectName: p.projectName
            }))
        }
    } catch (error) {
        console.error('Failed to fetch project options:', error)
        toast.show('error', '加载项目选项失败')
    }
})

// 当切换 tab 时刷新对应列表
watch(() => activeTab.value, (newTab) => {
    if (newTab === 'project' && projectPagination.value) {
        projectPagination.value.refresh()
    } else if (newTab === 'task' && taskPagination.value) {
        taskPagination.value.refresh()
    }
})
</script>
