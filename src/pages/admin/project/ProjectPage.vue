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
                        <label class="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                        <input v-model="taskForm.taskName" type="text" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
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
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="1">高</option>
                            <option value="2">中</option>
                            <option value="3">低</option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <select v-model="taskForm.status"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="未开始">未开始</option>
                            <option value="进行中">进行中</option>
                            <option value="已完成">已完成</option>
                            <option value="已暂停">已暂停</option>
                        </select>
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
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                        <DatePicker
                            v-model="taskForm.startTime"
                            placeholder="选择开始时间"
                        />
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">截止时间</label>
                        <DatePicker
                            v-model="taskForm.endTime"
                            placeholder="选择截止时间"
                        />
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
                        <label class="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                        <input v-model="projectForm.projectName" type="text" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                        <select v-model="projectForm.ownerId"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option v-for="user in userOptions" :key="user.userId" :value="user.userId">
                                {{ user.userName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                        <select v-model="projectForm.priority"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="1">高</option>
                            <option value="2">中</option>
                            <option value="3">低</option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <select v-model="projectForm.status"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="未开始">未开始</option>
                            <option value="进行中">进行中</option>
                            <option value="已完成">已完成</option>
                            <option value="已暂停">已暂停</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                        <DatePicker
                            v-model="projectForm.startTime"
                            placeholder="选择开始时间"
                        />
                    </div>
                    <div class="form-item">
                        <label class="block text-sm font-medium text-gray-700 mb-1">截止时间</label>
                        <DatePicker
                            v-model="projectForm.endTime"
                            placeholder="选择截止时间"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <label class="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                    <textarea v-model="projectForm.description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                </div>
            </div>
        </ModalForm>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskList from './TaskList.vue'
import ProjectList from './ProjectList.vue'
import ModalForm from '@/components/ModalForm.vue'
import Pagination from '@/components/Pagination.vue'
import { fetchTasks, addTask, updateTask, deleteTask } from '@/api/admin/task'
import { fetchProjects, addProject, updateProject, deleteProject } from '@/api/admin/project'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'
import DatePicker from '@/components/DatePicker.vue'

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
    status: '未开始',
    priority: '2',
    estimateHours: 0,
    startTime: null,
    endTime: null
})

const projectForm = ref({
    projectName: '',
    ownerId: '',
    status: '未开始',
    priority: '2',
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
    isConfirmLoading.value = true
    try {
        const api = taskFormMode.value === 'add' ? addTask : updateTask
        const res = await api(taskForm.value)
        if (res.success) {
            toast.show('success', `${taskFormMode.value === 'add' ? '新增' : '编辑'}任务成功`)
            taskModal.value.closeModal()
            refreshTaskList()
        } else {
            toast.show('error', res.errorMessage)
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
    isConfirmLoading.value = true
    try {
        const api = projectFormMode.value === 'add' ? addProject : updateProject
        const res = await api(projectForm.value)
        if (res.success) {
            toast.show('success', `${projectFormMode.value === 'add' ? '新增' : '编辑'}项目成功`)
            projectModal.value.closeModal()
            refreshProjectList()
        } else {
            toast.show('error', res.errorMessage)
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
                toast.show('error', res.errorMessage)
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
        status: '未开始',
        priority: '2',
        estimateHours: 0,
        startTime: null,
        endTime: null
    }
}

const clearProjectForm = () => {
    projectForm.value = {
        projectName: '',
        ownerId: '',
        status: '未开始',
        priority: '2',
        description: '',
        startTime: null,
        endTime: null
    }
}
</script>
