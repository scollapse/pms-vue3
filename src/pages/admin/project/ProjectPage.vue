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
                            项目看板
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
                <div v-show="activeTab === 'board'" role="tabpanel" class="flex">
                    <div class="flex-grow overflow-auto min-h-[600px]">
                        <ProjectBoard />
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import ProjectList from './ProjectList.vue'
import ProjectForm from './ProjectForm.vue'
import ProjectBoard from './ProjectBoard.vue'
import Pagination from '@/components/Pagination.vue'
import { fetchProjects, addProject, updateProject, deleteProject } from '@/api/admin/project'
import toast from '@/composables/utils/toast'
import modal from '@/composables/utils/modal'
import eventBus from '@/composables/utils/eventBus'
import '@/assets/styles/form.css'

const activeTab = ref('board')
const projects = ref([])
const isProjectLoading = ref(false)
const isConfirmLoading = ref(false)
const projectModal = ref(null)
const projectPagination = ref(null)
const projectFilters = ref({})

// 定义项目的分页大小
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

// 处理项目视图模式变化
const handleProjectViewModeChange = (size) => {
    projectSize.value = size
}

// 表单相关
const projectFormMode = ref('add')
const projectFormTitle = ref('新增项目')

const projectForm = ref({
    projectName: '',
    priority: '4',
    description: '',
    startTime: null,
    endTime: null
})

// 添加表单错误状态
const projectFormErrors = ref({
    projectName: '',
    priority: '',
    dateRange: ''
})

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
            eventBus.emit('project-options-updated', res.data)
        }
    } catch (error) {
        console.error('Failed to fetch project options:', error)
        toast.show('error', '加载项目选项失败')
    }
}

// 项目相关方法
const showEditProjectDialog = async (projectId) => {
    projectFormMode.value = 'edit'
    const project = projects.value.find(p => p.projectId === projectId)
    if (project) {
        projectForm.value = { ...project }
    }
}

//新增项目
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
            
            // 通知ProjectBoard组件刷新项目列表
            eventBus.emit('project-updated')
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
                // 通知ProjectBoard组件刷新数据
                eventBus.emit('project-updated')
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

// 初始化加载数据
onMounted(async () => {
    // 加载项目列表
    if (projectPagination.value) {
        await projectPagination.value.refresh()
    }

    // 初始加载项目选项
    await loadProjectOptions()
})

// 添加组件卸载时的清理逻辑
onUnmounted(() => {
    // 移除事件监听器
    eventBus.off('project-updated')
})

watch(() => activeTab.value, (newTab) => {
    if (newTab === 'project' && projectPagination.value) {
        projectPagination.value.refresh()
        // 切换到项目管理标签时，重置为新增模式
        projectFormMode.value = 'add'
        clearProjectForm()
    }
})
</script>
