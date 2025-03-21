<template>
  <div class="bg-gray-50 rounded-xl p-4 hover:shadow-sm transition-all">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-medium text-gray-700">{{ name }}</h3>
      <div class="flex items-center">
        <span class="text-gray-900 font-semibold">{{ consumed }}</span>
        <span class="text-gray-500 mx-1">/</span>
        <span class="text-gray-500">{{ goal }}{{ unit }}</span>
      </div>
    </div>
    
    <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        class="h-full transition-all duration-500 ease-out rounded-full"
        :class="`bg-${color}-500`"
        :style="`width: ${calculateProgress(consumed, goal)}`"
      ></div>
    </div>
    
    <div class="flex justify-between mt-2 text-xs">
      <span class="text-gray-500">0{{ unit }}</span>
      <span 
        :class="`text-${color}-600 font-medium`"
      >
        {{ Math.round((consumed / goal) * 100) }}%
      </span>
      <span class="text-gray-500">{{ goal }}{{ unit }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import useDietUtils from '../composables/useDietUtils'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  consumed: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'violet'
  }
})

const { calculateProgress } = useDietUtils()
</script> 