<template>
  <div class="health-record-form">
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 日期选择器 -->
      <div class="form-group">
        <label for="record-date" class="form-label">记录日期</label>
        <div class="relative">
          <flat-pickr 
            v-model="formData.date"
            :config="dateConfig"
            class="form-input"
            placeholder="选择日期"
            id="record-date"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CalendarIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div v-if="errors.date" class="form-error">{{ errors.date }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 体重 -->
        <div class="form-group">
          <label for="weight" class="form-label">体重 (kg)</label>
          <div class="relative">
            <input 
              type="number" 
              id="weight" 
              v-model="formData.weight" 
              step="0.1" 
              min="20" 
              max="300"
              class="form-input"
              placeholder="输入体重"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">kg</span>
            </div>
          </div>
          <div v-if="errors.weight" class="form-error">{{ errors.weight }}</div>
        </div>

        <!-- 体脂率 -->
        <div class="form-group">
          <label for="bodyFat" class="form-label">体脂率 (%)</label>
          <div class="relative">
            <input 
              type="number" 
              id="bodyFat" 
              v-model="formData.bodyFat" 
              step="0.1" 
              min="3" 
              max="50"
              class="form-input"
              placeholder="输入体脂率"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">%</span>
            </div>
          </div>
          <div v-if="errors.bodyFat" class="form-error">{{ errors.bodyFat }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 肌肉量 -->
        <div class="form-group">
          <label for="muscleMass" class="form-label">肌肉量 (kg)</label>
          <div class="relative">
            <input 
              type="number" 
              id="muscleMass" 
              v-model="formData.muscleMass" 
              step="0.1" 
              min="10" 
              max="100"
              class="form-input"
              placeholder="输入肌肉量"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">kg</span>
            </div>
          </div>
          <div v-if="errors.muscleMass" class="form-error">{{ errors.muscleMass }}</div>
        </div>

        <!-- 水分率 -->
        <div class="form-group">
          <label for="waterRate" class="form-label">水分率 (%)</label>
          <div class="relative">
            <input 
              type="number" 
              id="waterRate" 
              v-model="formData.waterRate" 
              step="0.1" 
              min="30" 
              max="70"
              class="form-input"
              placeholder="输入水分率"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">%</span>
            </div>
          </div>
          <div v-if="errors.waterRate" class="form-error">{{ errors.waterRate }}</div>
        </div>

        <!-- 骨量 -->
        <div class="form-group">
          <label for="boneMass" class="form-label">骨量 (kg)</label>
          <div class="relative">
            <input 
              type="number" 
              id="boneMass" 
              v-model="formData.boneMass" 
              step="0.1" 
              min="1" 
              max="10"
              class="form-input"
              placeholder="输入骨量"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">kg</span>
            </div>
          </div>
          <div v-if="errors.boneMass" class="form-error">{{ errors.boneMass }}</div>
        </div>
      </div>

      <!-- 备注 -->
      <div class="form-group">
        <label for="notes" class="form-label">备注信息</label>
        <textarea 
          id="notes" 
          v-model="formData.notes" 
          rows="3" 
          class="form-input"
          placeholder="输入备注信息（可选）"
        ></textarea>
      </div>

      <!-- 表单操作按钮 -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="btn btn-secondary">
          取消
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting"
          :class="{ 'opacity-75 pointer-events-none': isSubmitting }"
        >
          <span v-if="isSubmitting" class="mr-2">
            <svg class="animate-spin h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isEdit ? '保存修改' : '添加记录' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { CalendarIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';

// 定义Props
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

// 定义Emits
const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const formData = reactive({
  date: props.initialData.date || new Date(),
  weight: props.initialData.weight || '',
  bodyFat: props.initialData.bodyFat || '',
  muscleMass: props.initialData.muscleMass || '',
  waterRate: props.initialData.waterRate || '',
  boneMass: props.initialData.boneMass || '',
  notes: props.initialData.notes || ''
});

// 日期选择器配置
const dateConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  maxDate: new Date()
};

// 验证错误
const errors = reactive({
  date: '',
  weight: '',
  bodyFat: '',
  muscleMass: '',
  waterRate: '',
  boneMass: ''
});

// 提交状态
const isSubmitting = ref(false);

// 监听initialData变化
watch(() => props.initialData, (newValue) => {
  if (newValue) {
    Object.keys(newValue).forEach(key => {
      if (key in formData) {
        formData[key] = newValue[key];
      }
    });
  }
}, { deep: true });

// 验证表单
const validateForm = () => {
  let isValid = true;
  
  // 重置所有错误
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // 日期验证
  if (!formData.date) {
    errors.date = '请选择记录日期';
    isValid = false;
  }
  
  // 体重验证
  if (!formData.weight) {
    errors.weight = '请输入体重';
    isValid = false;
  } else if (formData.weight < 20 || formData.weight > 300) {
    errors.weight = '体重数值不合理';
    isValid = false;
  }
  
  // 体脂率验证
  if (!formData.bodyFat) {
    errors.bodyFat = '请输入体脂率';
    isValid = false;
  } else if (formData.bodyFat < 3 || formData.bodyFat > 50) {
    errors.bodyFat = '体脂率数值不合理';
    isValid = false;
  }
  
  // 肌肉量验证 (可选)
  if (formData.muscleMass && (formData.muscleMass < 10 || formData.muscleMass > 100)) {
    errors.muscleMass = '肌肉量数值不合理';
    isValid = false;
  }
  
  // 水分率验证 (可选)
  if (formData.waterRate && (formData.waterRate < 30 || formData.waterRate > 70)) {
    errors.waterRate = '水分率数值不合理';
    isValid = false;
  }
  
  // 骨量验证 (可选)
  if (formData.boneMass && (formData.boneMass < 1 || formData.boneMass > 10)) {
    errors.boneMass = '骨量数值不合理';
    isValid = false;
  }
  
  return isValid;
};

// 提交表单
const submitForm = async () => {
  // 验证表单
  if (!validateForm()) return;
  
  // 设置提交状态
  isSubmitting.value = true;
  
  try {
    // 准备提交的数据
    const recordData = {
      ...formData,
      // 确保日期是字符串格式，如果是Date对象则格式化
      date: typeof formData.date === 'object' ? format(formData.date, 'yyyy-MM-dd') : formData.date
    };
    
    // 将字符串数值转换为数字
    ['weight', 'bodyFat', 'muscleMass', 'waterRate', 'boneMass'].forEach(field => {
      if (recordData[field]) {
        recordData[field] = parseFloat(recordData[field]);
      }
    });
    
    // 设置ID，如果是编辑模式
    if (props.isEdit && props.initialData.id) {
      recordData.id = props.initialData.id;
    }
    
    // 发送数据到父组件
    emit('submit', recordData);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 成功后重置表单（仅在添加模式下）
    if (!props.isEdit) {
      Object.keys(formData).forEach(key => {
        if (key !== 'date') {
          formData[key] = '';
        }
      });
    }
  } catch (error) {
    console.error('提交表单时出错:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.health-record-form {
  @apply w-full;
}

.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
  @apply py-2 px-3 border transition duration-150 ease-in-out;
}

.form-error {
  @apply mt-1 text-sm text-red-600;
}

.btn {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}
</style> 