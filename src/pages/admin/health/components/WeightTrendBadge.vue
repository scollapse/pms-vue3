<template>
  <span 
    class="trend-badge"
    :class="badgeClass">
    <template v-if="trend === 'up'">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
      </svg>
      <span>{{ isBodyFat ? '+' : '↑' }}</span>
    </template>
    <template v-else-if="trend === 'down'">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
      <span>{{ isBodyFat ? '-' : '↓' }}</span>
    </template>
    <template v-else>
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path>
      </svg>
      <span>-</span>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  trend: {
    type: String,
    default: 'stable',
    validator: (value) => ['up', 'down', 'stable'].includes(value)
  },
  isBodyFat: {
    type: Boolean,
    default: false
  }
});

// 根据趋势和类型（体重/体脂）设置样式
const badgeClass = computed(() => {
  const isWeight = !props.isBodyFat;
  
  if (props.trend === 'up') {
    return {
      'bg-red-50 text-red-600': isWeight, // 体重上升为红色（不好）
      'bg-green-50 text-green-600': !isWeight // 体脂率上升为绿色（不好）
    };
  } else if (props.trend === 'down') {
    return {
      'bg-green-50 text-green-600': isWeight, // 体重下降为绿色（好）
      'bg-red-50 text-red-600': !isWeight // 体脂率下降为红色（好）
    };
  } else {
    return {
      'bg-gray-50 text-gray-600': true // 稳定为灰色
    };
  }
});
</script>

<style scoped>
.trend-badge {
  @apply inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium;
}
</style> 