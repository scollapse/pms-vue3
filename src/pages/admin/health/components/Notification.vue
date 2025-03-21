<template>
  <!-- 通知提示组件 -->
  <Transition name="notification">
    <div v-if="show" 
         class="fixed top-6 right-6 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border-l-4 flex items-start"
         :class="type === 'success' ? 'border-green-500' : 
                 type === 'warning' ? 'border-amber-500' : 
                 type === 'error' ? 'border-rose-500' : 'border-indigo-500'">
      <!-- 图标 -->
      <div v-if="type === 'success'" class="flex-shrink-0 w-5 h-5 mr-3 text-green-500">
        <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div v-else-if="type === 'warning'" class="flex-shrink-0 w-5 h-5 mr-3 text-amber-500">
        <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div v-else-if="type === 'error'" class="flex-shrink-0 w-5 h-5 mr-3 text-rose-500">
        <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div v-else class="flex-shrink-0 w-5 h-5 mr-3 text-indigo-500">
        <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <!-- 内容 -->
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
        <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
      </div>
      
      <!-- 关闭按钮 -->
      <button @click="closeNotification" 
              class="ml-4 flex-shrink-0 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeNotification = () => {
  emit('close')
}
</script>

<style scoped>
/* 通知提示动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>