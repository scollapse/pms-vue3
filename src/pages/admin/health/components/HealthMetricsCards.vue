<template>
  <div class="card shadow-lg">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 sm:p-3">
      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-indigo-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">体重</span>
            <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <ScaleIcon class="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ weight }} <span class="text-sm font-normal text-gray-500">kg</span></p>
          <p class="text-xs md:text-sm mt-1" :class="weightTrend.includes('↓') ? 'text-emerald-500' : 'text-rose-500'">
            较上次 <span class="font-medium">{{ weightTrend }}</span>
          </p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full bg-indigo-400 transition-all duration-1000 ease-out" 
                 :style="{ width: '65%', transform: 'translateX(-100%)', animation: 'slideRight 1.2s forwards' }"></div>
          </div>
        </div>
      </div>

      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-amber-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">体脂率</span>
            <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <ChartPieIcon class="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ bodyFat }}<span class="text-sm font-normal text-gray-500">%</span></p>
          <p class="text-xs md:text-sm mt-1" :class="bodyFatTrend.includes('↓') ? 'text-emerald-500' : 'text-rose-500'">
            较上次 <span class="font-medium">{{ bodyFatTrend }}</span>
          </p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all duration-1000 ease-out" 
                 :style="{ width: '55%', transform: 'translateX(-100%)', animation: 'slideRight 1.5s forwards' }"></div>
          </div>
        </div>
      </div>

      <div class="card-inner relative group overflow-hidden transform hover:scale-[1.02] transition-all duration-300 rounded-2xl bg-white">
        <div class="absolute top-0 right-0 w-28 h-28 bg-violet-50 rounded-bl-[80px] opacity-50 pointer-events-none"></div>
        <div class="p-4 md:p-5 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600 font-medium">BMI</span>
            <div class="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
              <CalculatorIcon class="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-0.5 transition-all duration-500">{{ bmi }}</p>
          <p class="text-xs md:text-sm mt-1 text-indigo-500">健康范围 <span class="font-medium">18.5-24.9</span></p>
          <div class="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                 :class="bmiStatusColorBar"
                 :style="{ width: (bmi / 30 * 100) + '%', transform: 'translateX(-100%)', animation: 'slideRight 1.8s forwards' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ScaleIcon, ChartPieIcon, CalculatorIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  weight: {
    type: Number,
    required: true
  },
  bodyFat: {
    type: Number,
    required: true
  },
  weightTrend: {
    type: String,
    required: true
  },
  bodyFatTrend: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
});

// 计算属性
const bmi = computed(() => {
  const bmiValue = props.weight / (props.height * props.height);
  return bmiValue.toFixed(1);
});

const bmiStatusColorBar = computed(() => {
  const bmiValue = parseFloat(bmi.value);
  if (bmiValue < 18.5) return 'bg-blue-400';
  if (bmiValue >= 18.5 && bmiValue < 25) return 'bg-emerald-400';
  if (bmiValue >= 25 && bmiValue < 30) return 'bg-amber-400';
  return 'bg-rose-400';
});
</script>

<style scoped>
.card-inner {
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-inner:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

@keyframes slideRight {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style> 