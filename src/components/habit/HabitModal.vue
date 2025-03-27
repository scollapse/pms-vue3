<template>
  <div>
    <!-- 悬浮添加按钮 -->
    <button 
      @click="openModal"
      class="fixed right-8 bottom-8 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pulse-animation"
    >
      <HabitIcon name="plus" size="lg" color="white" />
      <span class="absolute w-full h-full rounded-full bg-blue-400 opacity-75 ripple-effect"></span>
    </button>

    <!-- 模态框 -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <!-- 使模态框居中 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- 模态框内容 -->
        <div 
          class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-modal-in border border-gray-100"
          :class="{'opacity-100 translate-y-0': isOpen, 'opacity-0 translate-y-4': !isOpen}"
        >
          <!-- 模态框头部 -->
          <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg mr-3">
                <HabitIcon name="sparkles" color="blue" size="md" variant="solid" />
              </div>
              <h3 class="text-xl font-semibold text-gray-800" id="modal-title">
                创建新习惯
              </h3>
            </div>
          </div>

          <!-- 模态框内容 -->
          <div class="px-6 py-5 bg-white">
            <form @submit.prevent="saveHabit" class="space-y-5">
              <!-- 步骤指示器 -->
              <div class="flex items-center justify-between mb-6">
                <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center w-1/3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1"
                    :class="currentStep >= index + 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'">
                    {{ index + 1 }}
                  </div>
                  <div class="text-xs" :class="currentStep >= index + 1 ? 'text-blue-700' : 'text-gray-500'">
                    {{ step }}
                  </div>
                  <div v-if="index < steps.length - 1" class="h-0.5 w-full absolute"
                    :class="currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-200'"></div>
                </div>
              </div>

              <!-- 步骤1: 基本信息 -->
              <div v-if="currentStep === 1" class="space-y-4 fade-in">
                <!-- 名称和描述 -->
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label for="habit-name" class="block text-sm font-medium text-gray-700 mb-1">习惯名称</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HabitIcon name="pencil" size="sm" color="gray" />
                      </div>
                      <input 
                        type="text" 
                        id="habit-name" 
                        v-model="form.name" 
                        class="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg transition-all"
                        placeholder="给习惯起个名字，例如：每天阅读"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label for="habit-description" class="block text-sm font-medium text-gray-700 mb-1">习惯描述</label>
                    <div class="relative">
                      <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                        <HabitIcon name="document-text" size="sm" color="gray" />
                      </div>
                      <textarea 
                        id="habit-description" 
                        v-model="form.description" 
                        rows="3" 
                        class="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg transition-all resize-none"
                        placeholder="描述一下这个习惯的目标和意义"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- 类别选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">习惯类别</label>
                  <div class="grid grid-cols-3 gap-3">
                    <div 
                      v-for="category in categories" 
                      :key="category.value"
                      @click="selectCategory(category.value)"
                      class="p-3 cursor-pointer rounded-lg transition-all duration-200 border flex flex-col items-center hover:shadow-sm text-center"
                      :class="form.category === category.value ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-200'"
                    >
                      <div class="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                        :class="getCategoryBgColor(category.value)">
                        <HabitIcon :name="category.icon" :color="getCategoryColor(category.value)" />
                      </div>
                      <span class="text-sm font-medium" :class="form.category === category.value ? 'text-blue-700' : 'text-gray-700'">
                        {{ category.label }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤2: 图标和频率 -->
              <div v-if="currentStep === 2" class="space-y-5 fade-in">
                <!-- 习惯图标 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                  <div class="grid grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div 
                      v-for="icon in availableIcons" 
                      :key="icon"
                      @click="selectIcon(icon)"
                      class="p-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center aspect-square"
                      :class="form.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-gray-100'"
                    >
                      <HabitIcon :name="icon" size="md" :color="form.icon === icon ? 'blue' : 'gray'" />
                    </div>
                  </div>
                </div>
                
                <!-- 重复频率 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">重复频率</label>
                  <div class="space-y-3">
                    <div class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
                      <input 
                        type="checkbox" 
                        id="everyday" 
                        v-model="form.everyday" 
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                        @change="toggleEveryday"
                      />
                      <label for="everyday" class="ml-2 text-sm text-gray-700 flex-1">每天重复</label>
                      <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">推荐</span>
                    </div>
                    
                    <div v-if="!form.everyday" class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">选择重复的日期</label>
                      <div class="grid grid-cols-7 gap-2">
                        <button 
                          v-for="day in weekdays" 
                          :key="day.value"
                          type="button"
                          @click="toggleDay(day.value)"
                          class="flex flex-col items-center justify-center py-2 rounded-lg focus:outline-none transition-all duration-200"
                          :class="[
                            form.frequency.includes(day.value) 
                              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200'
                          ]"
                        >
                          <span class="text-xs font-medium mb-1">{{ day.short }}</span>
                          <span class="text-sm font-bold">{{ day.day }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤3: 积分和设置 -->
              <div v-if="currentStep === 3" class="space-y-5 fade-in">
                <!-- 积分设置 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">完成后获得积分</label>
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center justify-between mb-2">
                      <input 
                        type="range" 
                        v-model.number="form.points" 
                        min="1" 
                        max="20" 
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span class="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                        {{ form.points }} 积分
                      </span>
                    </div>
                    
                    <div class="flex justify-between text-xs text-gray-500 mb-3">
                      <span>较少</span>
                      <span>适中</span>
                      <span>较多</span>
                    </div>
                    
                    <div class="text-xs text-gray-600 bg-white p-3 rounded border border-gray-100 flex items-center">
                      <HabitIcon name="light-bulb" size="sm" color="yellow" class="mr-2" />
                      <span>提示：积分可用于兑换奖励，难度大的习惯可以设置更高的积分。</span>
                    </div>
                  </div>
                </div>

                <!-- 预览卡片 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">习惯卡片预览</label>
                  <div class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-4">
                    <div class="flex items-start">
                      <div class="p-2 rounded-lg mr-3" :class="getCategoryBgColor(form.category)">
                        <HabitIcon :name="form.icon" :color="getCategoryColor(form.category)" />
                      </div>
                      <div class="flex-1">
                        <h3 class="font-medium text-gray-800">{{ form.name || '习惯名称' }}</h3>
                        <p class="text-sm text-gray-500 mt-1">{{ form.description || '习惯描述' }}</p>
                        <div class="flex items-center mt-2 text-xs text-gray-500">
                          <HabitIcon name="calendar" size="xs" class="mr-1" />
                          <span>{{ getFrequencyText() }}</span>
                          <span class="mx-2">•</span>
                          <HabitIcon name="currency-dollar" size="xs" color="yellow" class="mr-1" />
                          <span>{{ form.points }} 积分</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 步骤控制按钮 -->
              <div class="flex justify-between border-t border-gray-100 pt-4 mt-4">
                <button 
                  type="button" 
                  @click="prevStep"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                  :class="{ 'opacity-0 pointer-events-none': currentStep === 1 }"
                >
                  <HabitIcon name="chevron-left" size="sm" class="mr-1" />
                  上一步
                </button>
                
                <div class="flex space-x-2">
                  <button 
                    type="button" 
                    @click="closeModal"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                  >
                    取消
                  </button>
                  
                  <button 
                    v-if="currentStep < steps.length"
                    type="button" 
                    @click="nextStep"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
                    :disabled="!canProceed"
                  >
                    下一步
                    <HabitIcon name="chevron-right" size="sm" color="white" class="ml-1" />
                  </button>
                  
                  <button 
                    v-else
                    type="submit" 
                    class="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all"
                  >
                    <HabitIcon name="check" size="sm" color="white" class="mr-1" />
                    创建习惯
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HabitIcon from './HabitIcon.vue';

// 步骤
const steps = ['基本信息', '图标和频率', '积分和设置'];
const currentStep = ref(1);

// 初始表单状态
const initialFormState = {
  name: '',
  description: '',
  icon: 'star',
  category: '',
  everyday: false,
  frequency: [],
  points: 5
};

// 表单数据
const form = ref({...initialFormState});

// 模态框状态
const isOpen = ref(false);

// 可选图标
const availableIcons = [
  'star', 'heart', 'fire', 'book-open', 'academic-cap', 'light-bulb', 'sun', 
  'music-note', 'trophy', 'sparkles', 'chart-bar', 'globe', 'clock', 'gift',
  'emoji-happy', 'calendar', 'check-circle', 'bell', 'cash'
];

// 习惯类别
const categories = [
  { label: '健康', value: 'health', icon: 'heart' },
  { label: '学习', value: 'learning', icon: 'academic-cap' },
  { label: '工作', value: 'work', icon: 'briefcase' },
  { label: '运动', value: 'fitness', icon: 'fire' },
  { label: '阅读', value: 'reading', icon: 'book-open' },
  { label: '冥想', value: 'meditation', icon: 'sparkles' },
  { label: '兴趣', value: 'hobby', icon: 'music-note' },
  { label: '财务', value: 'finance', icon: 'currency-dollar' },
  { label: '生活', value: 'life', icon: 'home' }
];

// 周几选项
const weekdays = [
  { label: '周一', value: '周一', short: '周一', day: '一' },
  { label: '周二', value: '周二', short: '周二', day: '二' },
  { label: '周三', value: '周三', short: '周三', day: '三' },
  { label: '周四', value: '周四', short: '周四', day: '四' },
  { label: '周五', value: '周五', short: '周五', day: '五' },
  { label: '周六', value: '周六', short: '周六', day: '六' },
  { label: '周日', value: '周日', short: '周日', day: '日' }
];

// 是否可以进行下一步
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.value.name && form.value.category;
  } else if (currentStep.value === 2) {
    return form.value.icon && 
           (form.value.everyday || form.value.frequency.length > 0);
  }
  return true;
});

// 打开模态框
const openModal = (category = '') => {
  isOpen.value = true;
  currentStep.value = 1;
  form.value = {...initialFormState};
  
  // 将传入的中文分类名转换为对应的英文category值
  if (category) {
    const categoryMap = {
      '健康': 'health',
      '学习': 'learning',
      '工作': 'work',
      '运动': 'fitness',
      '阅读': 'reading',
      '冥想': 'meditation',
      '兴趣': 'hobby',
      '财务': 'finance',
      '生活': 'life'
    };
    
    const mappedCategory = categoryMap[category] || category;
    console.log('设置分类:', category, '转换为:', mappedCategory);
    
    // 检查转换后的分类是否存在于可选分类中
    const categoryExists = categories.some(c => c.value === mappedCategory);
    
    if (categoryExists) {
      form.value.category = mappedCategory;
    } else {
      // 如果找不到匹配的类别，尝试直接匹配中文标签
      const categoryByLabel = categories.find(c => c.label === category);
      if (categoryByLabel) {
        form.value.category = categoryByLabel.value;
      } else {
        console.warn('未找到匹配的分类:', category);
      }
    }
  }
};

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
};

// 下一步
const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// 选择图标
const selectIcon = (icon) => {
  form.value.icon = icon;
};

// 选择习惯类别
const selectCategory = (category) => {
  form.value.category = category;
};

// 切换每天选项
const toggleEveryday = () => {
  if (form.value.everyday) {
    form.value.frequency = ['每天'];
  } else {
    form.value.frequency = [];
  }
};

// 切换特定天数
const toggleDay = (day) => {
  const index = form.value.frequency.indexOf(day);
  if (index === -1) {
    form.value.frequency.push(day);
  } else {
    form.value.frequency.splice(index, 1);
  }
};

// 获取类别背景颜色
const getCategoryBgColor = (category) => {
  const bgMap = {
    'health': 'bg-red-100',
    'learning': 'bg-indigo-100',
    'work': 'bg-blue-100',
    'fitness': 'bg-orange-100',
    'reading': 'bg-yellow-100',
    'meditation': 'bg-purple-100',
    'hobby': 'bg-pink-100',
    'finance': 'bg-green-100',
    'life': 'bg-teal-100'
  };
  return bgMap[category] || 'bg-gray-100';
};

// 获取类别颜色
const getCategoryColor = (category) => {
  const colorMap = {
    'health': 'red',
    'learning': 'indigo',
    'work': 'blue',
    'fitness': 'orange',
    'reading': 'yellow',
    'meditation': 'purple',
    'hobby': 'pink',
    'finance': 'green',
    'life': 'teal'
  };
  return colorMap[category] || 'gray';
};

// 获取频率文本
const getFrequencyText = () => {
  if (form.value.everyday) {
    return '每天';
  } else if (form.value.frequency.length > 0) {
    return form.value.frequency.join('、');
  }
  return '未设置';
};

// 保存习惯
const saveHabit = () => {
  // 验证表单
  if (!form.value.name) {
    alert('请输入习惯名称');
    return;
  }
  
  if (!form.value.category) {
    alert('请选择习惯类别');
    return;
  }
  
  if (!form.value.everyday && form.value.frequency.length === 0) {
    alert('请选择重复频率');
    return;
  }

  // 在实际应用中，这里会调用API保存数据
  console.log('保存习惯:', form.value);
  
  // 发出自定义事件，通知父组件
  const newHabit = {...form.value};
  const emit = defineEmits(['habit-added']);
  emit('habit-added', newHabit);
  
  // 关闭模态框
  closeModal();
};

// 向外部暴露方法
defineExpose({
  open: openModal
});
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-modal-in {
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(1rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.ripple-effect {
  animation: ripple 1.5s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 自定义range slider样式 */
input[type=range] {
  height: 6px;
  -webkit-appearance: none;
}

input[type=range]::-webkit-slider-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style> 