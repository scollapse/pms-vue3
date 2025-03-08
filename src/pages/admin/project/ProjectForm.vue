<template>
  <div class="bg-white rounded-xl shadow-md p-6 h-full overflow-y-auto">
    <h2 class="text-xl font-bold mb-6 text-gray-800">{{ formMode === 'add' ? '新增项目' : '编辑项目' }}</h2>
    
    <div class="form-container">
      <div class="form-grid form-grid-1">
        <div class="form-item">
          <label class="form-label">
            项目名称
            <span class="form-required">*</span>
          </label>
          <input 
            v-model="form.projectName" 
            type="text"
            class="form-input"
            :class="{ 'form-input-error': formErrors.projectName }"
            placeholder="请输入项目名称">
          <p v-if="formErrors.projectName" class="form-error-text">{{ formErrors.projectName }}</p>
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
          <label class="form-label">
            项目周期
            <span class="form-required">*</span>
          </label>
          <DateRangePicker 
            v-model:startDate="form.startTime" 
            v-model:endDate="form.endTime"
            placeholder="请选择开始和结束时间"
            :class="{ 'form-input-error': formErrors.dateRange }" />
          <p v-if="formErrors.dateRange" class="form-error-text">{{ formErrors.dateRange }}</p>
        </div>
        <div class="form-item">
          <label class="form-label">项目描述</label>
          <textarea 
            v-model="form.description" 
            rows="5" 
            class="form-textarea" 
            placeholder="请输入项目描述"></textarea>
        </div>
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
import '@/assets/styles/form.css'

const props = defineProps({
  projectData: {
    type: Object,
    default: () => ({})
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
  projectName: '',
  priority: '4',
  description: '',
  startTime: null,
  endTime: null
})

// 表单错误信息
const formErrors = ref({
  projectName: '',
  priority: '',
  dateRange: ''
})

// 监听表单字段变化，清除对应错误提示
watch(() => form.value.projectName, () => {
  formErrors.value.projectName = ''
})

watch(() => form.value.priority, () => {
  formErrors.value.priority = ''
})

// 监听日期范围变化
watch([
  () => form.value.startTime,
  () => form.value.endTime
], () => {
  formErrors.value.dateRange = ''
})

// 监听传入的项目数据变化
watch(() => props.projectData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    form.value = { ...newData }
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

// 重置表单
const resetForm = () => {
  form.value = {
    projectName: '',
    priority: '4',
    description: '',
    startTime: null,
    endTime: null
  }
  formErrors.value = {
    projectName: '',
    priority: '',
    dateRange: ''
  }
  // 通知父组件取消操作，并请求重置为新增模式
  emit('cancel', 'add')
}

// 提交表单
const submitForm = () => {
  // 重置错误信息
  formErrors.value = {
    projectName: '',
    priority: '',
    dateRange: ''
  }

  // 表单验证
  let isValid = true

  if (!form.value.projectName?.trim()) {
    formErrors.value.projectName = '请输入项目名称'
    isValid = false
  }

  if (!form.value.priority) {
    formErrors.value.priority = '请选择优先级'
    isValid = false
  }

  if (!form.value.startTime || !form.value.endTime) {
    formErrors.value.dateRange = '请选择项目周期'
    isValid = false
  }

  if (!isValid) {
    return
  }

  // 提交表单
  emit('submit', { ...form.value })
}
</script>
<style scoped>
/* 项目表单样式 */
</style>
