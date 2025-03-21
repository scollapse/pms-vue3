<template>
  <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center">
        <BeakerIcon class="w-5 h-5 mr-2 text-blue-500" />
        今日水分摄入
      </h2>
      <div class="flex space-x-1">
        <button 
          @click="$emit('decreaseWater')"
          class="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          :disabled="waterIntake.consumed <= 0"
        >
          <MinusIcon class="w-5 h-5" />
        </button>
        <button 
          @click="$emit('increaseWater')"
          class="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <PlusIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div class="flex items-center">
      <!-- 水杯图标 -->
      <div class="relative w-24 h-32 mx-auto mb-4">
        <svg viewBox="0 0 24 36" class="w-full h-full">
          <!-- 水杯边框 -->
          <path 
            d="M3,2 L21,2 C21.5523,2 22,2.44772 22,3 L22,33 C22,33.5523 21.5523,34 21,34 L3,34 C2.44772,34 2,33.5523 2,33 L2,3 C2,2.44772 2.44772,2 3,2 Z" 
            fill="white" 
            stroke="#e0e7ff" 
            stroke-width="1"
          />
          
          <!-- 水分填充部分 -->
          <rect
            x="2" 
            :y="34 - filledHeight" 
            width="20" 
            :height="filledHeight" 
            fill="url(#waterGradient)" 
            rx="0"
          />
          
          <!-- 水波纹效果 -->
          <path 
            :d="`M2,${34 - filledHeight + Math.sin(animationTime) * 1.5} 
                C7,${34 - filledHeight + Math.sin(animationTime + 1) * 2} 
                12,${34 - filledHeight + Math.sin(animationTime + 2) * 1.5} 
                22,${34 - filledHeight + Math.sin(animationTime + 3) * 2} 
                L22,34 L2,34 Z`" 
            fill="url(#waterGradient)"
          />
          
          <!-- 渐变定义 -->
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div class="ml-6 flex-1">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-600 text-sm">进度</span>
          <span class="text-blue-600 font-semibold">{{ percentage }}%</span>
        </div>
        
        <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            class="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${percentage}%`"
          ></div>
        </div>
        
        <div class="flex justify-between">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">{{ waterIntake.consumed }}</p>
            <p class="text-xs text-gray-500">已饮用 ({{ waterIntake.unit }})</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">{{ waterIntake.goal }}</p>
            <p class="text-xs text-gray-500">目标 ({{ waterIntake.unit }})</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { BeakerIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  waterIntake: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['increaseWater', 'decreaseWater'])

// 水杯动画相关
const animationTime = ref(0)
let animationFrame = null

const percentage = computed(() => {
  return Math.min(Math.round((props.waterIntake.consumed / props.waterIntake.goal) * 100), 100)
})

const filledHeight = computed(() => {
  return 32 * (props.waterIntake.consumed / props.waterIntake.goal)
})

const animate = () => {
  animationTime.value += 0.05
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script> 