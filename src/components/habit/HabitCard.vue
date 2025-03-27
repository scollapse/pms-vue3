<template>
  <div 
    class="habit-card bg-white rounded-xl shadow-sm border border-gray-50 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-1"
  >
    <div class="p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div :class="`flex items-center justify-center w-10 h-10 rounded-lg bg-${cardColor}-50 mr-3`">
            <HabitIcon :name="habit.icon || 'star'" :color="cardColor" size="md" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-800">{{ habit.name }}</h3>
            <p class="text-sm text-gray-500 mt-0.5">{{ habit.description || '暂无描述' }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="completeHabit"
            class="p-2 rounded-full transition-all duration-200 hover:bg-gray-50"
            :class="isCompleted ? `bg-${cardColor}-50 text-${cardColor}-500` : 'text-gray-400'"
          >
            <HabitIcon name="check-circle" size="md" :color="isCompleted ? cardColor : 'gray'" />
          </button>
        </div>
      </div>
      
      <div class="mt-4">
        <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div
            class="h-2 rounded-full transition-all duration-500 ease-in-out"
            :class="`bg-${cardColor}-500`"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <div class="flex items-center justify-between text-xs mt-1">
          <div class="flex items-center">
            <HabitIcon name="clock" size="sm" color="indigo" class="mr-1" />
            <span class="text-gray-600">{{ frequencyText }}</span>
          </div>
          <div class="flex items-center">
            <HabitIcon name="currency-dollar" size="sm" color="yellow" class="mr-1" />
            <span class="font-medium text-gray-700">{{ habit.points || 5 }} 积分</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100">
          
          <div class="flex items-center">
            <HabitIcon name="calendar" size="sm" color="gray" class="mr-1" />
            <span class="text-gray-500">{{ streakText }}</span>
          </div>
          <div class="flex items-center">
            <HabitIcon name="fire" size="sm" color="red" class="mr-1" />
            <span class="font-medium text-gray-700">{{ habit.streak || 0 }} 天</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HabitIcon from './HabitIcon.vue';

const props = defineProps({
  habit: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update']);

// 习惯是否已完成
const isCompleted = ref(props.habit.completed || false);

// 卡片颜色
const cardColor = computed(() => {
  const colorMap = {
    'daily': 'blue',
    'weekly': 'green',
    'milestone': 'purple',
    'study': 'indigo',
    'health': 'red',
    'work': 'yellow'
  };
  return colorMap[props.habit.type] || 'blue';
});

// 连续天数文本
const streakText = computed(() => {
  if (!props.habit.lastCompleted) {
    return '今天尚未完成';
  }
  
  // 在实际应用中，这里会用日期计算
  return `最近一次: ${props.habit.lastCompleted}`;
});

// 进度百分比
const progressPercent = computed(() => {
  if (isCompleted.value) return 100;
  // 如果有具体进度，可以在这里计算
  return 0;
});

// 获取频率文本
const frequencyText = computed(() => {
  if (props.habit.everyday) {
    return '每天';
  } else if (props.habit.frequency && props.habit.frequency.length > 0) {
    return props.habit.frequency.join('、');
  }
  return '无固定频率';
});

// 完成习惯
const completeHabit = () => {
  isCompleted.value = !isCompleted.value;
  
  // 在实际应用中，这里会调用API更新数据
  const updatedHabit = {
    ...props.habit,
    completed: isCompleted.value,
    lastCompleted: isCompleted.value ? new Date().toLocaleDateString() : props.habit.lastCompleted,
    streak: isCompleted.value ? (props.habit.streak || 0) + 1 : props.habit.streak
  };
  
  // 发出事件通知父组件
  emit('update', updatedHabit);
};
</script>

<style scoped>
.habit-card {
  animation: fadeIn 0.4s ease-out forwards;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transform: translateY(0);
}

.habit-card:hover {
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