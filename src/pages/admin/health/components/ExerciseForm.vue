<template>
  <div class="exercise-form">
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 日期选择器 -->
      <div class="form-group">
        <label for="exercise-date" class="form-label">运动日期</label>
        <div class="relative">
          <flat-pickr 
            v-model="formData.date"
            :config="dateConfig"
            class="form-input"
            placeholder="选择日期"
            id="exercise-date"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CalendarIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div v-if="errors.date" class="form-error">{{ errors.date }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 运动类型 -->
        <div class="form-group">
          <label for="exerciseType" class="form-label">运动类型</label>
          <div class="relative">
            <select 
              id="exerciseType" 
              v-model="formData.type" 
              class="form-input"
            >
              <option value="" disabled>选择运动类型</option>
              <option v-for="type in exerciseTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon class="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div v-if="errors.type" class="form-error">{{ errors.type }}</div>
        </div>

        <!-- 运动时长 -->
        <div class="form-group">
          <label for="duration" class="form-label">时长 (分钟)</label>
          <div class="relative">
            <input 
              type="number" 
              id="duration" 
              v-model="formData.duration" 
              min="1" 
              max="480"
              class="form-input"
              placeholder="输入运动时长"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">分钟</span>
            </div>
          </div>
          <div v-if="errors.duration" class="form-error">{{ errors.duration }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 运动强度 -->
        <div class="form-group">
          <label for="intensity" class="form-label">运动强度</label>
          <div class="flex flex-wrap gap-3 mt-2">
            <div 
              v-for="(level, index) in intensityLevels" 
              :key="index"
              @click="formData.intensity = index + 1"
              :class="[
                'intensity-option', 
                { 'active': formData.intensity === index + 1 }
              ]"
            >
              <span class="intensity-label">{{ level.label }}</span>
              <span class="intensity-value">{{ level.value }}</span>
            </div>
          </div>
          <div v-if="errors.intensity" class="form-error">{{ errors.intensity }}</div>
        </div>

        <!-- 热量消耗 -->
        <div class="form-group">
          <label for="calories" class="form-label">热量消耗 (卡路里)</label>
          <div class="relative">
            <input 
              type="number" 
              id="calories" 
              v-model="formData.calories" 
              min="1" 
              class="form-input"
              placeholder="输入消耗热量"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500">卡路里</span>
            </div>
          </div>
          <div v-if="errors.calories" class="form-error">{{ errors.calories }}</div>
        </div>
      </div>

      <!-- 运动描述 -->
      <div class="form-group">
        <label for="description" class="form-label">详细描述</label>
        <textarea 
          id="description" 
          v-model="formData.description" 
          rows="3" 
          class="form-input"
          placeholder="添加运动描述、感受或备注（可选）"
        ></textarea>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
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
  type: props.initialData.type || '',
  duration: props.initialData.duration || '',
  intensity: props.initialData.intensity || 2,
  calories: props.initialData.calories || '',
  description: props.initialData.description || ''
});

// 运动类型列表
const exerciseTypes = [
  { value: 'run', label: '跑步' },
  { value: 'walk', label: '走路' },
  { value: 'cycle', label: '骑行' },
  { value: 'swim', label: '游泳' },
  { value: 'weightlifting', label: '力量训练' },
  { value: 'yoga', label: '瑜伽' },
  { value: 'basketball', label: '篮球' },
  { value: 'football', label: '足球' },
  { value: 'tennis', label: '网球' },
  { value: 'dance', label: '舞蹈' },
  { value: 'hiit', label: '高强度间歇训练' },
  { value: 'other', label: '其他' }
];

// 运动强度级别
const intensityLevels = [
  { label: '轻度', value: '低心率区间' },
  { label: '中度', value: '有氧燃脂' },
  { label: '高度', value: '高强度' }
];

// 日期选择器配置
const dateConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  maxDate: new Date()
};

// 验证错误
const errors = reactive({
  date: '',
  type: '',
  duration: '',
  intensity: '',
  calories: ''
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

// 计算热量（当选择运动类型和时长后）
watch([() => formData.type, () => formData.duration, () => formData.intensity], () => {
  if (formData.type && formData.duration && formData.intensity && !formData.calories) {
    // 根据运动类型、时长和强度估算热量消耗
    calculateEstimatedCalories();
  }
});

// 估算热量消耗
const calculateEstimatedCalories = () => {
  // 基础卡路里消耗率（分钟/卡路里），根据运动类型和强度
  const baseRates = {
    run: [8, 12, 16],
    walk: [3, 5, 7],
    cycle: [6, 10, 14],
    swim: [7, 11, 15],
    weightlifting: [4, 6, 8],
    yoga: [3, 5, 7],
    basketball: [7, 10, 13],
    football: [7, 10, 13],
    tennis: [6, 9, 12],
    dance: [5, 8, 11],
    hiit: [10, 15, 20],
    other: [5, 8, 11]
  };
  
  const type = formData.type;
  const duration = parseInt(formData.duration) || 0;
  const intensityIndex = (formData.intensity - 1);
  
  if (type in baseRates && duration > 0) {
    const rate = baseRates[type][intensityIndex];
    formData.calories = Math.round(duration * rate);
  }
};

// 验证表单
const validateForm = () => {
  let isValid = true;
  
  // 重置所有错误
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // 日期验证
  if (!formData.date) {
    errors.date = '请选择运动日期';
    isValid = false;
  }
  
  // 运动类型验证
  if (!formData.type) {
    errors.type = '请选择运动类型';
    isValid = false;
  }
  
  // 运动时长验证
  if (!formData.duration) {
    errors.duration = '请输入运动时长';
    isValid = false;
  } else if (formData.duration < 1 || formData.duration > 480) {
    errors.duration = '时长应在1-480分钟之间';
    isValid = false;
  }
  
  // 强度验证
  if (!formData.intensity) {
    errors.intensity = '请选择运动强度';
    isValid = false;
  }
  
  // 热量验证
  if (!formData.calories) {
    errors.calories = '请输入热量消耗';
    isValid = false;
  } else if (formData.calories < 1) {
    errors.calories = '热量消耗应大于0';
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
    const exerciseData = {
      ...formData,
      // 确保日期是字符串格式，如果是Date对象则格式化
      date: typeof formData.date === 'object' ? format(formData.date, 'yyyy-MM-dd') : formData.date
    };
    
    // 将字符串数值转换为数字
    ['duration', 'intensity', 'calories'].forEach(field => {
      if (exerciseData[field]) {
        exerciseData[field] = parseFloat(exerciseData[field]);
      }
    });
    
    // 设置ID，如果是编辑模式
    if (props.isEdit && props.initialData.id) {
      exerciseData.id = props.initialData.id;
    }
    
    // 根据运动类型设置图标
    exerciseData.icon = getExerciseTypeIcon(exerciseData.type);
    
    // 发送数据到父组件
    emit('submit', exerciseData);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 成功后重置表单（仅在添加模式下）
    if (!props.isEdit) {
      resetForm();
    }
  } catch (error) {
    console.error('提交表单时出错:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 根据运动类型获取图标
const getExerciseTypeIcon = (type) => {
  const iconMap = {
    run: 'run',
    walk: 'walk',
    cycle: 'cycle',
    swim: 'swim',
    weightlifting: 'weightlifting',
    yoga: 'yoga',
    basketball: 'basketball',
    football: 'football',
    tennis: 'tennis',
    dance: 'dance',
    hiit: 'hiit',
    other: 'exercise'
  };
  
  return iconMap[type] || 'exercise';
};

// 重置表单
const resetForm = () => {
  formData.type = '';
  formData.duration = '';
  formData.intensity = 2;
  formData.calories = '';
  formData.description = '';
};
</script>

<style scoped>
.exercise-form {
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

.intensity-option {
  @apply flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 cursor-pointer transition-all;
  @apply bg-white hover:border-blue-200 hover:bg-blue-50 w-24;
}

.intensity-option.active {
  @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
}

.intensity-label {
  @apply font-medium text-gray-700 mb-1;
}

.intensity-value {
  @apply text-xs text-gray-500;
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