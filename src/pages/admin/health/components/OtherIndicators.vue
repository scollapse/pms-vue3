<template>
  <div class="card shadow-lg h-full">
    <div class="card-header">
      <h3 class="font-medium text-xl text-gray-800">其他指标</h3>
      <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-300">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
    <div class="card-body">
      <div class="space-y-6 md:space-y-8">
        <!-- 肌肉量 -->
        <div class="indicator-item" data-aos="fade-up" data-aos-delay="100">
          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-gray-700 font-medium">肌肉量</span>
              <span class="ml-2 px-2 py-0.5 bg-green-50 text-green-500 text-xs font-medium rounded-full">优</span>
            </div>
            <span class="text-indigo-500 font-semibold">{{ muscleMass }}kg</span>
          </div>
          <div class="relative mt-1">
            <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-400 rounded-full transition-all duration-1000 indicator-bar" :style="{ width: '75%' }"></div>
            </div>
            <!-- 指示线和标签 -->
            <div class="flex justify-between mt-1 text-xs relative">
              <div class="absolute left-0 top-0 w-full flex">
                <div style="width: 25%" class="text-gray-400 flex flex-col items-start">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏低</span>
                </div>
                <div style="width: 40%" class="text-gray-400 flex flex-col items-center">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>健康</span>
                </div>
                <div style="width: 35%" class="text-gray-400 flex flex-col items-end">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏高</span>
                </div>
              </div>
            </div>
            <!-- 当前位置标记 -->
            <div class="w-4 h-4 bg-white absolute top-0 rounded-full shadow-md border-2 border-green-500 transform -translate-y-1/2 transition-all duration-1000"
                style="left: 75%; margin-left: -8px;"></div>
          </div>
        </div>

        <!-- 水分率 -->
        <div class="indicator-item" data-aos="fade-up" data-aos-delay="200">
          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-gray-700 font-medium">水分率</span>
              <span class="ml-2 px-2 py-0.5 bg-blue-50 text-blue-500 text-xs font-medium rounded-full">正常</span>
            </div>
            <span class="text-indigo-500 font-semibold">{{ waterRate }}%</span>
          </div>
          <div class="relative mt-1">
            <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-blue-400 rounded-full transition-all duration-1000 indicator-bar" :style="{ width: '65%' }"></div>
            </div>
            <!-- 指示线和标签 -->
            <div class="flex justify-between mt-1 text-xs relative">
              <div class="absolute left-0 top-0 w-full flex">
                <div style="width: 35%" class="text-gray-400 flex flex-col items-start">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏低</span>
                </div>
                <div style="width: 40%" class="text-gray-400 flex flex-col items-center">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>健康</span>
                </div>
                <div style="width: 25%" class="text-gray-400 flex flex-col items-end">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏高</span>
                </div>
              </div>
            </div>
            <!-- 当前位置标记 -->
            <div class="w-4 h-4 bg-white absolute top-0 rounded-full shadow-md border-2 border-blue-500 transform -translate-y-1/2 transition-all duration-1000"
                style="left: 65%; margin-left: -8px;"></div>
          </div>
        </div>

        <!-- 骨量 -->
        <div class="indicator-item" data-aos="fade-up" data-aos-delay="300">
          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-gray-700 font-medium">骨量</span>
              <span class="ml-2 px-2 py-0.5 bg-purple-50 text-purple-500 text-xs font-medium rounded-full">优</span>
            </div>
            <span class="text-indigo-500 font-semibold">{{ boneMass }}kg</span>
          </div>
          <div class="relative mt-1">
            <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-400 rounded-full transition-all duration-1000 indicator-bar" :style="{ width: '80%' }"></div>
            </div>
            <!-- 指示线和标签 -->
            <div class="flex justify-between mt-1 text-xs relative">
              <div class="absolute left-0 top-0 w-full flex">
                <div style="width: 30%" class="text-gray-400 flex flex-col items-start">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏低</span>
                </div>
                <div style="width: 40%" class="text-gray-400 flex flex-col items-center">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>健康</span>
                </div>
                <div style="width: 30%" class="text-gray-400 flex flex-col items-end">
                  <div class="h-2 border-l border-gray-200"></div>
                  <span>偏高</span>
                </div>
              </div>
            </div>
            <!-- 当前位置标记 -->
            <div class="w-4 h-4 bg-white absolute top-0 rounded-full shadow-md border-2 border-purple-500 transform -translate-y-1/2 transition-all duration-1000"
                style="left: 80%; margin-left: -8px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

defineProps({
  muscleMass: {
    type: Number,
    required: true
  },
  waterRate: {
    type: Number,
    required: true
  },
  boneMass: {
    type: Number,
    required: true
  }
});

onMounted(() => {
  // 激活进度条动画
  setTimeout(() => {
    document.querySelectorAll('.indicator-item').forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('indicator-active');
      }, index * 200);
    });
  }, 300);
});
</script>

<style scoped>
.indicator-bar {
  transform: translateX(-100%);
  animation: slideRight 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.indicator-item {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.6s ease-out;
}

.indicator-active {
  opacity: 1;
  transform: translateY(0);
}

@keyframes slideRight {
  to {
    transform: translateX(0);
  }
}
</style> 