<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <Transition name="fade">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
        </Transition>

        <!-- 居中内容定位 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- 弹窗内容 -->
        <Transition name="slide-up">
          <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <!-- 标题 -->
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  设置健康目标
                </h3>
                <button @click="$emit('close')" 
                  class="rounded-full p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- 表单内容 -->
            <div class="px-6 py-5">
              <div class="space-y-6">
                <!-- 目标类型 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">目标类型</label>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      @click="form.goalType = 'weight'"
                      class="py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.goalType === 'weight' ? 'bg-indigo-50 border-indigo-200 text-indigo-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex flex-col items-center">
                        <ScaleIcon class="w-5 h-5 mb-1" />
                        体重目标
                      </div>
                    </button>
                    <button 
                      @click="form.goalType = 'bodyFat'"
                      class="py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.goalType === 'bodyFat' ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex flex-col items-center">
                        <ChartPieIcon class="w-5 h-5 mb-1" />
                        体脂率目标
                      </div>
                    </button>
                    <button 
                      @click="form.goalType = 'exercise'"
                      class="py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.goalType === 'exercise' ? 'bg-green-50 border-green-200 text-green-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex flex-col items-center">
                        <RunningIcon class="w-5 h-5 mb-1" />
                        运动目标
                      </div>
                    </button>
                  </div>
                </div>
                
                <!-- 目标参数设置 -->
                <template v-if="form.goalType === 'weight'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">目标体重 (kg)</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" step="0.1" v-model="form.targetWeight"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">当前体重 (kg)</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" step="0.1" v-model="form.currentWeight" disabled
                             class="bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">kg</span>
                      </div>
                    </div>
                  </div>
                </template>
                
                <template v-if="form.goalType === 'bodyFat'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">目标体脂率 (%)</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" step="0.1" v-model="form.targetBodyFat"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">当前体脂率 (%)</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" step="0.1" v-model="form.currentBodyFat" disabled
                             class="bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </template>
                
                <template v-if="form.goalType === 'exercise'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">每周运动次数</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" v-model="form.exerciseFrequency"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">次/周</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">每次运动时长 (分钟)</label>
                    <div class="relative rounded-md shadow-sm">
                      <input type="number" v-model="form.exerciseDuration"
                             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">分钟</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">运动类型</label>
                    <select v-model="form.exerciseType"
                            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-300 rounded-md">
                      <option value="cardio">有氧运动</option>
                      <option value="strength">力量训练</option>
                      <option value="flexibility">柔韧性训练</option>
                      <option value="mixed">混合训练</option>
                    </select>
                  </div>
                </template>
                
                <!-- 目标日期 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">目标完成日期</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="date" v-model="form.targetDate" 
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                
                <!-- 备注 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">目标备注</label>
                  <div class="relative rounded-md shadow-sm">
                    <textarea v-model="form.notes" rows="3"
                              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="添加关于目标的额外信息、动机或提醒..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse">
              <button @click="saveGoal" 
                      class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                保存
              </button>
              <button @click="$emit('close')" 
                      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                取消
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { XMarkIcon, ScaleIcon, ChartPieIcon, CalendarIcon } from '@heroicons/vue/24/outline';

// 自定义图标
const RunningIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm-5.657-2.343l-3.2 3.2a1 1 0 001.415 1.415l3.2-3.2a1 1 0 00-1.415-1.415zm11.314 0a1 1 0 00-1.415 1.415l3.2 3.2a1 1 0 001.415-1.415l-3.2-3.2z" />
    </svg>
  `
};

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  currentData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  goalType: 'weight',
  targetWeight: 65,
  currentWeight: 70,
  targetBodyFat: 15,
  currentBodyFat: 20,
  exerciseFrequency: 3,
  exerciseDuration: 45,
  exerciseType: 'mixed',
  targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
  notes: ''
});

// 初始化表单数据
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value.currentWeight = props.currentData.weight || 70;
      form.value.currentBodyFat = props.currentData.bodyFat || 20;
      
      // 如果有初始目标数据，填充表单
      if (props.initialData && Object.keys(props.initialData).length > 0) {
        form.value = { ...form.value, ...props.initialData };
      }
    }
  },
  { immediate: true }
);

// 保存目标
const saveGoal = () => {
  emit('save', { ...form.value });
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 