<template>
  <div class="flex items-center p-4 hover:bg-gray-50 transition-colors">
    <div class="w-14 h-14 rounded-xl overflow-hidden mr-4 flex-shrink-0 shadow-sm">
      <img :src="food.image" class="w-full h-full object-cover" alt="食物图片" />
    </div>
    <div class="flex-grow">
      <h4 class="text-gray-800 font-medium">{{ food.name }}</h4>
      <div class="flex items-center mt-1">
        <p class="text-gray-500 text-sm mr-3">{{ food.amount }}</p>
        <p class="text-amber-500 text-sm flex items-center font-medium">
          <FireIcon class="w-3.5 h-3.5 mr-1" />
          {{ food.calories }}卡路里
        </p>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-2">
        <span 
          v-for="tag in food.tags" 
          :key="tag" 
          :class="`${getTagClass(tag)} text-xs px-2.5 py-0.5 rounded-full shadow-sm`"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="flex ml-2">
      <button 
        @click="$emit('edit')"
        class="p-2 text-gray-400 hover:text-violet-500 rounded-lg hover:bg-violet-50 transition-colors"
      >
        <PencilIcon class="w-4 h-4" />
      </button>
      <button 
        @click="$emit('remove')"
        class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { FireIcon } from '@heroicons/vue/24/solid'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import useDietUtils from '../composables/useDietUtils'

const props = defineProps({
  food: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'remove'])

const { getTagClass } = useDietUtils()
</script> 