<template>
  <div class="habit-card-wrapper">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center">
        <div :class="`flex items-center justify-center w-10 h-10 rounded-lg bg-${color}-50 mr-3`">
          <HabitIcon :name="icon" :color="color" size="md" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
          <p class="text-sm text-gray-500">{{ habits.length }} 个习惯</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- 使用命名插槽传递自定义操作按钮 -->
        <slot name="action"></slot>
        
        <button 
          class="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-all duration-200"
          @click="isCollapsed = !isCollapsed"
        >
          <HabitIcon :name="isCollapsed ? 'arrow-down' : 'arrow-up'" size="sm" />
        </button>
      </div>
    </div>
    
    <div 
      v-if="!isCollapsed"
      class="transition-all duration-300 ease-in-out"
    >
      <slot></slot>
    </div>
    
    <div v-if="isCollapsed" @click="isCollapsed = !isCollapsed" class="flex items-center justify-center text-gray-500 py-6 bg-gray-50 rounded-lg border border-gray-100">
      <HabitIcon name="arrow-down" size="sm" color="gray" class="mr-2" />
      <span class="text-sm" >点击展开查看习惯</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HabitIcon from './HabitIcon.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'collection'
  },
  color: {
    type: String,
    default: 'blue'
  },
  habits: {
    type: Array,
    default: () => []
  }
});

// 是否折叠
const isCollapsed = ref(false);

// 添加习惯
const toggleAddHabit = () => {
  // 这里可以发出一个事件，让父组件打开添加习惯的模态框
  // 并预设分类为当前分类
  const event = new CustomEvent('add-habit', {
    detail: { category: props.title }
  });
  window.dispatchEvent(event);
};
</script>

<style scoped>
.habit-card-wrapper {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>