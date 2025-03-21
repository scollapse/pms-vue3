<template>
  <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-5 flex items-center">
      <ChartBarIcon class="w-5 h-5 mr-2 text-violet-500" />
      今日营养摄入
    </h2>
    
    <!-- 营养素卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <NutrientProgressBar
        v-for="(item, key) in nutritionSummary"
        :key="key"
        :name="getNutrientName(key)"
        :consumed="item.consumed"
        :goal="item.goal"
        :unit="item.unit"
        :color="getNutrientColor(key)"
      />
    </div>
  </div>
</template>

<script setup>
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import NutrientProgressBar from './NutrientProgressBar.vue'

const props = defineProps({
  nutritionSummary: {
    type: Object,
    required: true
  }
})

const getNutrientName = (key) => {
  const names = {
    calories: '热量',
    protein: '蛋白质',
    carbs: '碳水化合物',
    fat: '脂肪'
  }
  return names[key] || key
}

const getNutrientColor = (key) => {
  const colors = {
    calories: 'amber',
    protein: 'red',
    carbs: 'blue',
    fat: 'purple'
  }
  return colors[key] || 'gray'
}
</script> 