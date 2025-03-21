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
                  记录新体征数据
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
                <!-- 测量时间 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">测量时间</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="date" v-model="form.date" 
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>

                <!-- 身高 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">身高 (米)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.01" v-model="form.height"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">m</span>
                    </div>
                  </div>
                </div>

                <!-- 体重 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">体重 (公斤)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.1" v-model="form.weight"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <!-- 体脂率 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">体脂率 (%)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.1" v-model="form.bodyFat"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>

                <!-- 肌肉量 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">肌肉量 (公斤)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.1" v-model="form.muscleMass"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <!-- 水分率 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">水分率 (%)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.1" v-model="form.waterRate"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>

                <!-- 骨量 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">骨量 (公斤)</label>
                  <div class="relative rounded-md shadow-sm">
                    <input type="number" step="0.1" v-model="form.boneMass"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 py-2 sm:text-sm border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse">
              <button @click="saveRecord" 
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
  date: new Date().toISOString().split('T')[0],
  height: 1.75,
  weight: 70,
  bodyFat: 20,
  muscleMass: 30,
  waterRate: 60,
  boneMass: 3.5
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

const saveRecord = () => {
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