<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <!-- 膳食标题 -->
    <div class="flex items-center p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div :class="`${mealIconBg} p-2.5 rounded-xl mr-3 shadow-sm`">
        <component :is="mealIcon" class="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 class="font-medium text-gray-800">{{ meal.type }}</h3>
        <p class="text-gray-500 text-sm">{{ meal.time }} • {{ meal.calories }}卡路里</p>
      </div>
      <button 
        @click="$emit('add-food', meal.type)"
        class="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
      </button>
    </div>
    
    <!-- 食物列表 -->
    <div class="divide-y divide-gray-100">
      <FoodItem 
        v-for="(item, idx) in meal.items" 
        :key="`${meal.type}-${idx}`"
        :food="item"
        @remove="$emit('remove-food', meal.type, idx)"
        @edit="$emit('edit-food', meal.type, idx)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import useDietUtils from '../composables/useDietUtils'
import FoodItem from './FoodItem.vue'

const props = defineProps({
  meal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-food', 'remove-food', 'edit-food'])

const { getMealIcon, getMealIconBg } = useDietUtils()

const mealIcon = computed(() => getMealIcon(props.meal.type))
const mealIconBg = computed(() => getMealIconBg(props.meal.type))
</script> 