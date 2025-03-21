<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <Transition name="fade">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
        </Transition>

        <!-- 居中内容定位 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- 弹窗内容 -->
        <Transition name="slide-up">
          <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
            <!-- 标题 -->
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  健康分析报告
                </h3>
                <button @click="$emit('close')" 
                  class="rounded-full p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- 报告内容 -->
            <div class="bg-white px-6 py-5 max-h-[70vh] overflow-y-auto">
              <!-- 加载状态 -->
              <div v-if="loading" class="h-64 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <span class="ml-3 text-gray-700">分析报告生成中...</span>
              </div>
              
              <!-- 报告主体 -->
              <div v-else>
                <!-- 报告摘要 -->
                <div class="mb-8">
                  <h4 class="text-xl font-medium text-gray-800 mb-4">健康状况摘要</h4>
                  <div class="bg-indigo-50 p-4 rounded-lg">
                    <p class="text-gray-700 mb-3">
                      根据过去 {{ analysisData.period }} 的数据分析，您的整体健康状况处于
                      <span class="font-medium" :class="{
                        'text-green-500': analysisData.overall === '良好',
                        'text-amber-500': analysisData.overall === '一般',
                        'text-rose-500': analysisData.overall === '需要改善'
                      }">{{ analysisData.overall }}</span> 水平。
                    </p>
                    <p class="text-gray-700">
                      {{ analysisData.summary }}
                    </p>
                  </div>
                </div>
                
                <!-- 指标分析 -->
                <div class="mb-8">
                  <h4 class="text-xl font-medium text-gray-800 mb-4">指标分析</h4>
                  
                  <div class="space-y-4">
                    <!-- 体重分析 -->
                    <div class="p-4 border border-gray-100 rounded-lg shadow-sm">
                      <div class="flex items-center mb-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                          <ScaleIcon class="w-5 h-5 text-indigo-500" />
                        </div>
                        <h5 class="text-base font-medium text-gray-800">体重</h5>
                      </div>
                      
                      <div class="ml-13">
                        <p class="text-gray-700 mb-2">
                          当前体重：<span class="font-medium">{{ analysisData.metrics.weight.current }} kg</span>
                        </p>
                        <p class="text-gray-700 mb-2">
                          变化趋势：
                          <span class="font-medium" :class="{
                            'text-green-500': analysisData.metrics.weight.trend === '下降',
                            'text-rose-500': analysisData.metrics.weight.trend === '上升',
                            'text-blue-500': analysisData.metrics.weight.trend === '稳定'
                          }">{{ analysisData.metrics.weight.trend }}</span>
                          ({{ analysisData.metrics.weight.change }})
                        </p>
                        <p class="text-gray-700">
                          {{ analysisData.metrics.weight.analysis }}
                        </p>
                      </div>
                    </div>
                    
                    <!-- 体脂率分析 -->
                    <div class="p-4 border border-gray-100 rounded-lg shadow-sm">
                      <div class="flex items-center mb-3">
                        <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                          <ChartPieIcon class="w-5 h-5 text-amber-500" />
                        </div>
                        <h5 class="text-base font-medium text-gray-800">体脂率</h5>
                      </div>
                      
                      <div class="ml-13">
                        <p class="text-gray-700 mb-2">
                          当前体脂率：<span class="font-medium">{{ analysisData.metrics.bodyFat.current }}%</span>
                        </p>
                        <p class="text-gray-700 mb-2">
                          变化趋势：
                          <span class="font-medium" :class="{
                            'text-green-500': analysisData.metrics.bodyFat.trend === '下降',
                            'text-rose-500': analysisData.metrics.bodyFat.trend === '上升',
                            'text-blue-500': analysisData.metrics.bodyFat.trend === '稳定'
                          }">{{ analysisData.metrics.bodyFat.trend }}</span>
                          ({{ analysisData.metrics.bodyFat.change }})
                        </p>
                        <p class="text-gray-700">
                          {{ analysisData.metrics.bodyFat.analysis }}
                        </p>
                      </div>
                    </div>
                    
                    <!-- BMI分析 -->
                    <div class="p-4 border border-gray-100 rounded-lg shadow-sm">
                      <div class="flex items-center mb-3">
                        <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                          <CalculatorIcon class="w-5 h-5 text-purple-500" />
                        </div>
                        <h5 class="text-base font-medium text-gray-800">BMI</h5>
                      </div>
                      
                      <div class="ml-13">
                        <p class="text-gray-700 mb-2">
                          当前BMI：<span class="font-medium">{{ analysisData.metrics.bmi.current }}</span>
                        </p>
                        <p class="text-gray-700 mb-2">
                          BMI状态：
                          <span class="font-medium" :class="{
                            'text-blue-500': analysisData.metrics.bmi.status === '偏瘦',
                            'text-green-500': analysisData.metrics.bmi.status === '健康',
                            'text-amber-500': analysisData.metrics.bmi.status === '超重',
                            'text-rose-500': analysisData.metrics.bmi.status === '肥胖'
                          }">{{ analysisData.metrics.bmi.status }}</span>
                        </p>
                        <p class="text-gray-700">
                          {{ analysisData.metrics.bmi.analysis }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 改善建议 -->
                <div class="mb-8">
                  <h4 class="text-xl font-medium text-gray-800 mb-4">改善建议</h4>
                  
                  <div class="space-y-3">
                    <div v-for="(suggestion, index) in analysisData.suggestions" :key="index"
                         class="flex items-start">
                      <div class="mt-0.5 mr-3 flex-shrink-0">
                        <CheckCircleIcon class="w-5 h-5 text-green-500" />
                      </div>
                      <p class="text-gray-700">{{ suggestion }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- 运动建议 -->
                <div>
                  <h4 class="text-xl font-medium text-gray-800 mb-4">运动建议</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(exercise, index) in analysisData.exercises" :key="index"
                         class="p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div class="flex items-center mb-3">
                        <!-- 运动图标 -->
                        <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                             :class="{
                               'bg-blue-50': exercise.type === '有氧运动',
                               'bg-red-50': exercise.type === '力量训练',
                               'bg-purple-50': exercise.type === '柔韧性'
                             }">
                          <component :is="getExerciseIcon(exercise.type)" 
                                    class="w-5 h-5" 
                                    :class="{
                                      'text-blue-500': exercise.type === '有氧运动',
                                      'text-rose-500': exercise.type === '力量训练',
                                      'text-purple-500': exercise.type === '柔韧性'
                                    }" />
                        </div>
                        
                        <!-- 运动名称和类型 -->
                        <div>
                          <h5 class="text-base font-medium text-gray-800">{{ exercise.name }}</h5>
                          <span class="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                                :class="{
                                  'bg-blue-50 text-blue-500': exercise.type === '有氧运动',
                                  'bg-red-50 text-rose-500': exercise.type === '力量训练',
                                  'bg-purple-50 text-purple-500': exercise.type === '柔韧性'
                                }">
                            {{ exercise.type }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- 运动详情 -->
                      <p class="text-gray-700 text-sm mb-3">{{ exercise.description }}</p>
                      
                      <div class="grid grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span class="block">推荐频率</span>
                          <span class="font-medium text-gray-700">{{ exercise.frequency }}</span>
                        </div>
                        <div>
                          <span class="block">时长</span>
                          <span class="font-medium text-gray-700">{{ exercise.duration }}</span>
                        </div>
                        <div>
                          <span class="block">强度</span>
                          <span class="font-medium text-gray-700">{{ exercise.intensity }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 底部按钮 -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between">
              <button @click="exportReport" 
                      class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <DocumentArrowDownIcon class="w-5 h-5 mr-2 text-gray-500" />
                导出报告
              </button>
              <button @click="$emit('close')" 
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                关闭
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { 
  XMarkIcon, 
  ScaleIcon, 
  ChartPieIcon, 
  CalculatorIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  analysisData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'export']);

// 运动图标组件
const RunningIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm-5.657-2.343l-3.2 3.2a1 1 0 001.415 1.415l3.2-3.2a1 1 0 00-1.415-1.415zm11.314 0a1 1 0 00-1.415 1.415l3.2 3.2a1 1 0 001.415-1.415l-3.2-3.2z" />
    </svg>
  `
};

const WeightIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zM10 4h4v2h-4V4zm0 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  `
};

const YogaIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM9 14l6-6 4.83 4.83a2 2 0 010 2.83l-.17.17a2 2 0 01-2.83 0l-4-4-6 6V14z" />
    </svg>
  `
};

// 获取运动类型对应的图标
const getExerciseIcon = (type) => {
  switch (type) {
    case '有氧运动':
      return RunningIcon;
    case '力量训练':
      return WeightIcon;
    case '柔韧性':
      return YogaIcon;
    default:
      return RunningIcon;
  }
};

// 导出报告
const exportReport = () => {
  emit('export', props.analysisData);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 