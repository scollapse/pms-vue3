<template>
  <div class="card shadow-lg h-full">
    <div class="card-header">
      <h3 class="font-medium text-xl text-gray-800">目标达成度</h3>
      <div class="flex items-center space-x-2">
        <div class="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
          进行中
        </div>
        <button @click="$emit('showGoalSettings')" 
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-300 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body flex flex-col items-center">
      <!-- 环形进度条 -->
      <div class="relative w-40 md:w-44 h-40 md:h-44 mb-4 progress-container">
        <!-- 渐变定义 -->
        <svg width="0" height="0" class="absolute">
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#8b5cf6" />
            </linearGradient>
            <!-- 阴影滤镜 -->
            <filter id="progress-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#818cf8" flood-opacity="0.3"/>
            </filter>
          </defs>
        </svg>
        
        <!-- 背景圆 -->
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <!-- 外层轨道 -->
          <circle cx="50" cy="50" r="44" fill="none" stroke="#f0f5ff" stroke-width="8" />
          
          <!-- 进度圆弧 -->
          <circle cx="50" cy="50" r="44" fill="none" 
                 stroke="url(#progress-gradient)" stroke-width="8"
                 stroke-linecap="round"
                 stroke-dasharray="276.46" 
                 :stroke-dashoffset="progressOffset"
                 transform="rotate(-90 50 50)"
                 filter="url(#progress-shadow)"
                 class="progress-circle" />
        </svg>
        
        <!-- 中间文字 -->
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-3xl md:text-4xl font-bold text-gray-800 percentage-counter">{{ progressPercentage }}%</span>
          <span class="text-xs md:text-sm text-indigo-500 mt-1">已达成</span>
        </div>
      </div>
      
      <div class="text-center w-full">
        <p class="text-center text-base md:text-lg text-gray-700 mb-3">
          目标体重: <span class="font-semibold text-indigo-600">{{ targetWeight }}kg</span>
        </p>
        
        <!-- 从当前到目标的可视化 -->
        <div class="w-full px-2 relative">
          <div class="flex justify-between text-xs md:text-sm mb-2">
            <span class="text-gray-600">当前: <span class="font-medium text-indigo-500">{{ currentWeight }}kg</span></span>
            <span class="text-gray-600">目标: <span class="font-medium text-emerald-500">{{ targetWeight }}kg</span></span>
          </div>
          <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
            <!-- 渐变进度条 -->
            <div class="h-full rounded-full progress-bar"
                 :style="{
                   width: `${progressPercentage}%`,
                   background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                 }"></div>
            
            <!-- 指示标记 - 当前位置 -->
            <div class="absolute h-5 w-5 bg-white rounded-full shadow-md border-2 border-indigo-500 top-1/2 transform -translate-y-1/2 transition-all duration-1000"
                 :style="{left: `calc(${progressPercentage}% - 10px)`}">
            </div>
          </div>
          
          <!-- 时间提示 -->
          <p class="text-xs text-gray-500 mt-4 text-center">
            预计达成日期: <span class="font-medium">2023年12月31日</span>
            <br class="md:hidden" />
            <span class="hidden md:inline">·</span> 
            <span>还有45天</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progressPercentage: {
    type: Number,
    required: true
  },
  progressOffset: {
    type: Number,
    required: true
  },
  targetWeight: {
    type: Number,
    required: true
  },
  currentWeight: {
    type: Number,
    required: true
  }
});

defineEmits(['showGoalSettings']);
</script>

<style scoped>
.progress-circle {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: pulseShadow 2s infinite alternate;
}

.progress-container {
  animation: floatingContainer 6s infinite ease-in-out;
}

.progress-bar {
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.3) 50%, 
    rgba(255,255,255,0) 100%);
  animation: shimmer 2s infinite;
}

.percentage-counter {
  counter-reset: percentage var(--percentage, 0);
  animation: countUp 2s forwards;
}

@keyframes pulseShadow {
  0% {
    filter: drop-shadow(0 0 2px rgba(129, 140, 248, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 5px rgba(129, 140, 248, 0.5));
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes floatingContainer {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style> 