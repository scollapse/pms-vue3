<template>
  <div 
    class="achievement-card rounded-xl border overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1"
    :class="[
      achievement.unlocked 
        ? 'bg-white border-blue-100 shadow-sm hover:shadow-md' 
        : 'bg-white border-gray-50 shadow-sm hover:shadow'
    ]"
  >
    <!-- 成就内容区域 -->
    <div class="p-5">
      <div class="flex items-center mb-4">
        <!-- 图标区域 -->
        <div 
          class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
          :class="achievement.unlocked ? 'bg-blue-50' : 'bg-gray-50'"
        >
          <HabitIcon
            :name="achievement.icon"
            size="lg"
            :color="achievement.unlocked ? 'blue' : 'gray'"
          />
        </div>
        
        <!-- 标题和描述 -->
        <div class="flex-1">
          <div class="flex items-center">
            <h3 
              class="text-lg font-semibold" 
              :class="achievement.unlocked ? 'text-gray-800' : 'text-gray-600'"
            >
              {{ achievement.name }}
            </h3>
            <span 
              v-if="achievement.unlocked" 
              class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700"
            >
              已解锁
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ achievement.description }}</p>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="mt-3">
        <div class="flex justify-between items-center mb-1.5">
          <p class="text-xs text-gray-500">进度</p>
          <p class="text-xs font-medium text-gray-700">{{ achievement.progress }}/{{ achievement.total }}</p>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :class="getProgressBarColor(achievement.progress / achievement.total)"
            :style="{ width: `${(achievement.progress / achievement.total) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 底部奖励区域 -->
    <div 
      class="p-3 flex items-center justify-between border-t"
      :class="achievement.unlocked ? 'border-blue-100 bg-blue-50' : 'border-gray-100 bg-gray-50'"
    >
      <span class="text-sm text-gray-500">奖励</span>
      <div class="flex items-center">
        <HabitIcon name="currency-dollar" color="yellow" class="mr-1" />
        <span 
          class="text-base font-semibold"
          :class="achievement.unlocked ? 'text-blue-700' : 'text-gray-400'"
        >
          {{ achievement.reward }} 积分
        </span>
      </div>
    </div>
    
    <!-- 闪耀效果 (仅在解锁状态显示) -->
    <div v-if="achievement.unlocked" class="achievement-sparkle"></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import HabitIcon from '@/components/habit/HabitIcon.vue';

const props = defineProps({
  achievement: {
    type: Object,
    required: true
  }
});

// 根据进度比例获取进度条颜色
const getProgressBarColor = (ratio) => {
  if (ratio >= 1) return 'bg-blue-500';
  if (ratio >= 0.7) return 'bg-blue-400';
  if (ratio >= 0.3) return 'bg-blue-300';
  return 'bg-blue-200';
};
</script>

<style scoped>
.achievement-card {
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transform: translateY(0);
}

.achievement-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
}

.achievement-sparkle {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  transform: rotate(45deg);
  pointer-events: none;
  opacity: 0.1;
  animation: sparkle 3s infinite ease-in-out;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.1;
    transform: rotate(45deg) scale(1);
  }
  50% {
    opacity: 0.2;
    transform: rotate(45deg) scale(1.05);
  }
}
</style>
