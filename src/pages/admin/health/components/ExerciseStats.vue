<template>
  <div class="card shadow-lg">
    <div class="grid grid-cols-3 gap-3 p-2 sm:p-3">
      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">活动时长</span>
            <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <ClockIcon class="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ stats.duration }} <span class="text-sm font-normal text-gray-500">小时</span></p>
          <p class="text-xs md:text-sm mt-1 text-emerald-500">
            较上周 <span class="font-medium">+0.8小时</span>
          </p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full bg-blue-400 transition-all duration-1000 ease-out" 
                 :style="{ width: '65%', transform: 'translateX(-100%)', animation: 'slideRight 1.2s forwards' }"></div>
          </div>
        </div>
      </div>

      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-rose-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">消耗热量</span>
            <div class="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <FireIcon class="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ stats.calories }}<span class="text-sm font-normal text-gray-500">千卡</span></p>
          <p class="text-xs md:text-sm mt-1 text-emerald-500">
            较上周 <span class="font-medium">+200千卡</span>
          </p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full bg-rose-400 transition-all duration-1000 ease-out" 
                 :style="{ width: '55%', transform: 'translateX(-100%)', animation: 'slideRight 1.5s forwards' }"></div>
          </div>
        </div>
      </div>

      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">运动次数</span>
            <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <TrophyIcon class="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ stats.count }}<span class="text-sm font-normal text-gray-500">次</span></p>
          <p class="text-xs md:text-sm mt-1 text-emerald-500">
            较上周 <span class="font-medium">+1次</span>
          </p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full bg-emerald-400 transition-all duration-1000 ease-out" 
                 :style="{ width: '70%', transform: 'translateX(-100%)', animation: 'slideRight 1.8s forwards' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon, FireIcon, TrophyIcon } from '@heroicons/vue/24/outline';

defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.card-inner {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-inner:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

@keyframes slideRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style> 