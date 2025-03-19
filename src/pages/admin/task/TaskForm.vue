<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full overflow-y-auto">
    <h2 class="text-xl font-bold mb-6 text-gray-800">{{ formMode === 'add' ? '新增任务' : '编辑任务' }}</h2>
    
    <div class="form-container">
      <div class="form-grid form-grid-2">
        <div class="form-item">
          <label class="form-label">
            任务名称
            <span class="form-required">*</span>
          </label>
          <input 
            v-model="form.taskName" 
            type="text"
            class="form-input"
            :class="{ 'form-input-error': formErrors.taskName }"
            placeholder="请输入任务名称">
          <p v-if="formErrors.taskName" class="form-error-text">{{ formErrors.taskName }}</p>
        </div>
        <div class="form-item">
          <label class="form-label">所属项目</label>
          <select v-model="form.projectId" class="form-select">
            <option v-for="project in projectOptions" :key="project.projectId" :value="project.projectId">
              {{ project.projectName }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label">
            优先级
            <span class="form-required">*</span>
          </label>
          <select 
            v-model="form.priority"
            class="form-select"
            :class="{ 'form-input-error': formErrors.priority }">
            <option value="1">P1</option>
            <option value="2">P2</option>
            <option value="3">P3</option>
            <option value="4">P4</option>
          </select>
          <p v-if="formErrors.priority" class="form-error-text">{{ formErrors.priority }}</p>
        </div>
        <div class="form-item">
          <label class="form-label">预计工时</label>
          <input v-model="form.estimateHours" type="number" class="form-input">
        </div>
      </div>
      <div class="form-grid form-grid-1">
        <div class="form-item">
          <label class="form-label">
            任务周期
            <span class="form-required">*</span>
          </label>
          <DateRangePicker 
            v-model:startDate="form.startTime" 
            v-model:endDate="form.endTime"
            placeholder="请选择开始和结束时间"
            :class="{ 'form-input-error': formErrors.dateRange }" />
          <p v-if="formErrors.dateRange" class="form-error-text">{{ formErrors.dateRange }}</p>
        </div>
      </div>
      <div class="form-item">
        <label class="form-label">标签</label>
        <TagInput
          v-model="form.tags"
          :max-tags="3"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3 mt-6">
      <button 
        @click="resetForm"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
        取消
      </button>
      <button 
        @click="submitForm"
        :disabled="isLoading"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="isLoading" class="inline-block animate-spin mr-2">⟳</span>
        {{ formMode === 'add' ? '新增' : '保存' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import DateRangePicker from '@/components/DateRangePicker.vue'
import TagInput from '@/components/TagInput.vue'
import '@/assets/styles/form.css'

const props = defineProps({
  taskData: {
    type: Object,
    default: () => ({})
  },
  projectOptions: {
    type: Array,
    default: () => []
  },
  formMode: {
    type: String,
    default: 'add'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 表单数据
const form = ref({
  taskName: '',
  projectId: '',
  priority: '4',
  estimateHours: 0,
  startTime: null,
  endTime: null,
  tags: []
})

// 表单错误
const formErrors = ref({
  taskName: '',
  priority: '',
  dateRange: ''
})

// 监听props变化，更新表单数据
watch(() => props.taskData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = { ...newData }
  }
}, { immediate: true, deep: true })

// 提交表单
const submitForm = () => {
  // 重置错误信息
  formErrors.value = {
    taskName: '',
    priority: '',
    dateRange: ''
  }

  // 表单验证
  let isValid = true

  if (!form.value.taskName?.trim()) {
    formErrors.value.taskName = '请输入任务名称'
    isValid = false
  }

  if (!form.value.priority) {
    formErrors.value.priority = '请选择优先级'
    isValid = false
  }

  if (!form.value.startTime || !form.value.endTime) {
    formErrors.value.dateRange = '请选择任务周期'
    isValid = false
  }

  if (!isValid) {
    return
  }

  emit('submit', form.value)
}

// 重置表单
const resetForm = () => {
  if (props.formMode === 'add') {
    form.value = {
      taskName: '',
      projectId: '',
      priority: '4',
      estimateHours: 0,
      startTime: null,
      endTime: null,
      tags: []
    }
  } else {
    // 编辑模式下，恢复到原始数据
    form.value = { ...props.taskData }
  }
  
  // 清除错误信息
  formErrors.value = {
    taskName: '',
    priority: '',
    dateRange: ''
  }
  
  emit('cancel')
}
</script>