<template>
  <div class="statistic-card p-5 bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-1">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
        <div class="mt-2 flex items-end">
          <span class="text-2xl font-bold text-gray-800">{{ value }}</span>
          <span v-if="unit" class="ml-1 text-sm text-gray-500 font-medium">{{ unit }}</span>
        </div>
      </div>
      <div :class="`flex items-center justify-center w-12 h-12 rounded-lg bg-${color}-50`">
        <HabitIcon :name="icon" :color="color" />
      </div>
    </div>
    
    <div v-if="showProgress" class="mt-5">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs text-gray-500">{{ progressLabel }}</span>
        <span class="text-xs font-medium text-gray-700">{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-500 ease-out"
          :class="`bg-${color}-${progressPercentage < 30 ? '300' : (progressPercentage < 70 ? '400' : '500')}`"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
    
    <div v-if="trend" class="mt-4 flex items-center" :class="trendColor">
      <HabitIcon :name="trendIcon" size="sm" :color="trendColor.includes('green') ? 'green' : (trendColor.includes('red') ? 'red' : 'gray')" class="mr-1" />
      <span class="text-xs font-medium">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HabitIcon from './HabitIcon.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'chart-bar'
  },
  color: {
    type: String,
    default: 'blue'
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progressLabel: {
    type: String,
    default: 'Progress'
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    default: ''
  },
  trendDirection: {
    type: String,
    default: 'neutral' // 'up', 'down', 'neutral'
  }
});

// 根据趋势方向计算图标和颜色
const trendIcon = computed(() => {
  if (props.trendDirection === 'up') return 'arrow-up';
  if (props.trendDirection === 'down') return 'arrow-down';
  return 'arrow-right';
});

const trendColor = computed(() => {
  if (props.trendDirection === 'up') return 'text-green-500';
  if (props.trendDirection === 'down') return 'text-red-500';
  return 'text-gray-500';
});
</script>

<style scoped>
.statistic-card {
  animation: fadeIn 0.5s ease-out forwards;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transform: translateY(0);
}

.statistic-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
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
</style> 