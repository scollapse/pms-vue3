<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
    <div class="px-6 py-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto w-full">
        <div class="flex items-center justify-between">
          <!-- 返回按钮和标题 -->
          <div class="flex items-center">
            <router-link 
              to="/admin/habit/index" 
              class="mr-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <h1 class="text-xl font-bold text-gray-800">创建新习惯</h1>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto w-full px-4 md:px-6 py-6">
      <div class="max-w-3xl mx-auto">
        <!-- 创建表单进度指示器 -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">1</div>
              <span class="mt-2 text-sm font-medium text-indigo-800">基本信息</span>
            </div>
            <div class="flex-1 h-1 mx-4 bg-gray-200 relative">
              <div class="absolute inset-0 bg-indigo-500 rounded" :style="{ width: form.name && form.category ? '100%' : '0%' }"></div>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                :class="form.name && form.category ? 'bg-indigo-600' : 'bg-gray-300'"
              >2</div>
              <span class="mt-2 text-sm font-medium" :class="form.name && form.category ? 'text-indigo-800' : 'text-gray-500'">频率设置</span>
            </div>
            <div class="flex-1 h-1 mx-4 bg-gray-200 relative">
              <div class="absolute inset-0 bg-indigo-500 rounded" :style="{ width: form.frequency.length > 0 ? '100%' : '0%' }"></div>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                :class="form.frequency.length > 0 ? 'bg-indigo-600' : 'bg-gray-300'"
              >3</div>
              <span class="mt-2 text-sm font-medium" :class="form.frequency.length > 0 ? 'text-indigo-800' : 'text-gray-500'">完成</span>
            </div>
          </div>
        </div>
        
        <!-- 表单卡片 -->
        <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
          <form @submit.prevent="submitForm">
            <!-- 习惯类型选择 -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-gray-800 mb-4">选择习惯类型</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  type="button"
                  v-for="type in habitTypeOptions" 
                  :key="type.value"
                  @click="selectHabitType(type.value)"
                  class="p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center hover:shadow-md"
                  :class="form.type === type.value ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-200'"
                >
                  <div 
                    class="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    :class="form.type === type.value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'"
                  >
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        v-if="type.icon === 'star'" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                      />
                      <path 
                        v-else-if="type.icon === 'fire'" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" 
                      />
                      <path 
                        v-else-if="type.icon === 'book'" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                      />
                      <path 
                        v-else
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium" :class="form.type === type.value ? 'text-indigo-800' : 'text-gray-700'">
                    {{ type.label }}
                  </span>
                </button>
              </div>
            </div>
            
            <!-- 名称和类别 -->
            <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 名称 -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">习惯名称</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="name" 
                    v-model="form.name" 
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="输入习惯名称" 
                    required
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
                <p v-if="form.name.length > 0 && form.name.length < 2" class="mt-1 text-xs text-red-500">
                  名称至少需要2个字符
                </p>
              </div>
              
              <!-- 类别 -->
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">选择类别</label>
                <div class="relative">
                  <select 
                    id="category" 
                    v-model="form.category" 
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all"
                    required
                  >
                    <option disabled value="">请选择类别</option>
                    <option 
                      v-for="category in categoryOptions" 
                      :key="category" 
                      :value="category"
                    >
                      {{ category }}
                    </option>
                    <option value="新类别">添加新类别...</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 新类别输入 (条件渲染) -->
            <div v-if="form.category === '新类别'" class="mb-8">
              <label for="newCategory" class="block text-sm font-medium text-gray-700 mb-1">新类别名称</label>
              <div class="relative">
                <input 
                  type="text" 
                  id="newCategory" 
                  v-model="form.newCategory" 
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="输入新类别名称" 
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 图标选择 -->
            <div class="mb-8">
              <IconPicker 
                v-model="form.icon" 
                label="选择图标"
              />
            </div>
            
            <!-- 分隔线 -->
            <div class="border-t border-gray-100 my-8"></div>
            
            <!-- 频率选择 -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-gray-800 mb-4">设置重复频率</h2>
              
              <div class="space-y-4">
                <!-- 每天选项 -->
                <div class="flex items-center p-4 border rounded-lg"
                  :class="form.everyday ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'"
                >
                  <label class="flex items-center cursor-pointer w-full">
                    <input 
                      type="checkbox" 
                      id="everyday" 
                      v-model="form.everyday" 
                      class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      @change="toggleEveryday"
                    />
                    <span class="ml-2 text-gray-700 font-medium">每天重复</span>
                    <span class="ml-auto text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full" v-if="form.everyday">
                      推荐选项
                    </span>
                  </label>
                </div>
                
                <!-- 自定义天数选择 -->
                <div v-if="!form.everyday" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">选择重复的星期</h3>
                  <div class="grid grid-cols-7 gap-2">
                    <button 
                      v-for="day in weekdays" 
                      :key="day.value"
                      type="button"
                      @click="toggleDay(day.value)"
                      class="flex flex-col items-center justify-center py-3 rounded-lg focus:outline-none transition-all duration-200"
                      :class="[
                        form.frequency.includes(day.value) 
                          ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200'
                      ]"
                    >
                      <span class="text-xs font-medium mb-1">{{ day.short }}</span>
                      <span class="text-sm font-bold">{{ day.day }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 积分设置 -->
            <div class="mb-8">
              <h2 class="text-lg font-bold text-gray-800 mb-4">奖励设置</h2>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label for="points" class="block text-sm font-medium text-gray-700 mb-2">完成后获得积分</label>
                <div class="flex items-center">
                  <input 
                    type="range" 
                    id="points" 
                    v-model.number="form.points" 
                    min="1" 
                    max="20" 
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span class="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg">
                    {{ form.points }} 积分
                  </span>
                </div>
                
                <div class="mt-3 flex justify-between text-xs text-gray-500">
                  <span>较少</span>
                  <span>适中</span>
                  <span>较多</span>
                </div>
                
                <div class="mt-4 text-xs text-gray-600 bg-white p-3 rounded border border-gray-100">
                  <p class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    提示：积分可用于兑换奖励，难度较大的习惯可以设置更高的积分。
                  </p>
                </div>
              </div>
            </div>
            
            <!-- 提交按钮 -->
            <div class="flex justify-end pt-4 border-t border-gray-100">
              <router-link 
                to="/admin/habit/index" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors mr-2"
              >
                取消
              </router-link>
              <button 
                type="submit" 
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                :disabled="!isFormValid"
                :class="isFormValid ? '' : 'opacity-50 cursor-not-allowed'"
              >
                <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                创建习惯
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHabitStore } from '@/stores/habit';
import IconPicker from '@/components/habit/IconPicker.vue';

const router = useRouter();
const habitStore = useHabitStore();

// 表单数据
const form = ref({
  name: '',
  type: '',
  category: '',
  newCategory: '',
  icon: 'star',
  everyday: false,
  frequency: [],
  points: 5
});

// 习惯类型选项
const habitTypeOptions = [
  { label: '学习', value: 'study', icon: 'book' },
  { label: '运动', value: 'fitness', icon: 'fire' },
  { label: '生活', value: 'life', icon: 'star' },
  { label: '其他', value: 'other', icon: 'grid' }
];

// 选择习惯类型
const selectHabitType = (type) => {
  form.value.type = type;
  
  // 根据类型预设类别
  if (type === 'study') {
    form.value.category = '学习';
  } else if (type === 'fitness') {
    form.value.category = '健康';
  } else if (type === 'life') {
    form.value.category = '生活';
  }
};

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

// 类别选项
const categoryOptions = computed(() => {
  return ['学习', '工作', '健康', '生活', '娱乐', ...habitStore.categories.filter(cat => 
    !['学习', '工作', '健康', '生活', '娱乐'].includes(cat)
  )];
});

// 表单验证
const isFormValid = computed(() => {
  return (
    form.value.name.length > 1 && 
    (form.value.category || (form.value.category === '新类别' && form.value.newCategory)) &&
    form.value.frequency.length > 0
  );
});

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

// 提交表单
const submitForm = () => {
  // 验证
  if (!form.value.name) {
    alert('请输入习惯名称');
    return;
  }
  
  if (!form.value.category && !form.value.newCategory) {
    alert('请选择或创建类别');
    return;
  }
  
  if (form.value.frequency.length === 0) {
    alert('请选择重复频率');
    return;
  }
  
  // 处理新类别
  const finalCategory = form.value.category === '新类别' ? form.value.newCategory : form.value.category;
  
  // 创建习惯对象
  const newHabit = {
    name: form.value.name,
    category: finalCategory,
    icon: form.value.icon,
    frequency: form.value.frequency,
    points: form.value.points
  };
  
  // 添加到 store
  habitStore.addHabit(newHabit);
  
  // 导航回列表页
  router.push('/admin/habit/index');
};
</script>

<style>
/* 自定义范围滑块样式 */
input[type=range] {
  height: 6px;
  -webkit-appearance: none;
}

input[type=range]::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type=range]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type=range]::-ms-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
</style> 