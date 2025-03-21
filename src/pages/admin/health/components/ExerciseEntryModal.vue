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
            <!-- 表单标题 -->
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  添加运动记录
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
                <!-- 运动类型选择器 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">运动类型</label>
                  <div class="flex space-x-3">
                    <button 
                      @click="form.type = '有氧运动'" 
                      class="flex-1 py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.type === '有氧运动' ? 'bg-blue-50 border-blue-200 text-blue-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex justify-center items-center">
                        <RunningIcon class="w-5 h-5 mr-2" />
                        有氧运动
                      </div>
                    </button>
                    <button 
                      @click="form.type = '力量训练'" 
                      class="flex-1 py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.type === '力量训练' ? 'bg-red-50 border-red-200 text-rose-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex justify-center items-center">
                        <WeightIcon class="w-5 h-5 mr-2" />
                        力量训练
                      </div>
                    </button>
                    <button 
                      @click="form.type = '柔韧性'" 
                      class="flex-1 py-3 px-4 rounded-lg border transition-all text-sm" 
                      :class="form.type === '柔韧性' ? 'bg-purple-50 border-purple-200 text-purple-500' : 'border-gray-200 hover:bg-gray-50'">
                      <div class="flex justify-center items-center">
                        <YogaIcon class="w-5 h-5 mr-2" />
                        柔韧性
                      </div>
                    </button>
                  </div>
                </div>

                <!-- 运动名称 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">运动名称</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="text" v-model="form.name"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 sm:text-sm border-gray-300 rounded-md" 
                           placeholder="例如：跑步、力量训练、瑜伽" />
                  </div>
                </div>

                <!-- 运动时间 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">运动时间</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="date" v-model="form.date" 
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>

                <!-- 运动时长 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">运动时长 (分钟)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" v-model="form.duration"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">分钟</span>
                    </div>
                  </div>
                </div>

                <!-- 消耗热量 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">消耗热量 (千卡)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" v-model="form.calories"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">千卡</span>
                    </div>
                  </div>
                </div>

                <!-- 平均心率 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">平均心率 (次/分)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" v-model="form.heartRate"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">次/分</span>
                    </div>
                  </div>
                </div>

                <!-- 备注 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
                  <div class="relative rounded-md shadow-sm">
                    <textarea v-model="form.notes" rows="3"
                              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="在这里添加关于本次运动的其他信息..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse">
              <button @click="saveExercise" 
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
import { XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline';

// 自定义图标
const RunningIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm-5.657-2.343l-3.2 3.2a1 1 0 001.415 1.415l3.2-3.2a1 1 0 00-1.415-1.415zm11.314 0a1 1 0 00-1.415 1.415l3.2 3.2a1 1 0 001.415-1.415l-3.2-3.2z" />
    </svg>
  `
};

const WeightIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zM10 4h4v2h-4V4zm0 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  `
};

const YogaIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM9 14l6-6 4.83 4.83a2 2 0 010 2.83l-.17.17a2 2 0 01-2.83 0l-4-4-6 6V14z" />
    </svg>
  `
};

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  type: '有氧运动',
  name: '',
  date: new Date().toISOString().split('T')[0],
  duration: 45,
  calories: 300,
  heartRate: 130,
  notes: ''
});

// 当编辑现有数据时填充表单
watch(
  () => props.editData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal };
    }
  },
  { immediate: true }
);

const saveExercise = () => {
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