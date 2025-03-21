<template>
  <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-5 flex items-center">
      <ClockIcon class="w-5 h-5 mr-2 text-violet-500" />
      常用食物
    </h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="food in frequentFoods" 
        :key="food.name"
        class="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer"
        @click="$emit('add-frequent-food', food)"
      >
        <div class="w-10 h-10 rounded-lg overflow-hidden mr-3 shadow-sm">
          <img :src="food.image" class="w-full h-full object-cover" alt="食物图片" />
        </div>
        <div>
          <h4 class="text-gray-800 font-medium text-sm">{{ food.name }}</h4>
          <p class="text-amber-500 text-xs flex items-center">
            <FireIcon class="w-3 h-3 mr-0.5" />
            {{ food.calories }}卡路里
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'
import { FireIcon } from '@heroicons/vue/24/solid'

defineProps({
  frequentFoods: {
    type: Array,
    required: true
  }
})

defineEmits(['add-frequent-food'])
</script> 