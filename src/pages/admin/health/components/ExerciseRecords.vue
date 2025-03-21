<template>
  <div class="card shadow-lg">
    <div class="card-header">
      <h3 class="font-medium text-xl text-gray-800">近期运动记录</h3>
      <div class="flex gap-2">
        <button 
          @click="$emit('showHistory')" 
          class="px-4 py-2 bg-blue-50 text-blue-500 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-100 flex items-center shadow-sm hover:shadow">
          <ClockIcon class="w-4 h-4 mr-1.5" />
          历史记录
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- 加载状态 -->
      <div v-if="loading" class="h-64 flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p class="text-gray-500 text-sm">数据加载中...</p>
        </div>
      </div>
      
      <!-- 运动记录列表 -->
      <div v-else>
        <div v-if="exercises.length === 0" class="py-16 text-center">
          <DocumentIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p class="text-gray-500 mb-2">暂无运动记录</p>
          <button 
            @click="$emit('showExerciseForm')" 
            class="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-600 inline-flex items-center mt-2">
            <PlusIcon class="w-4 h-4 mr-1.5" />
            添加记录
          </button>
        </div>
        
        <div v-else class="overflow-hidden">
          <ul class="divide-y divide-gray-100">
            <li 
              v-for="(exercise, index) in exercises" 
              :key="index"
              class="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-gray-50 px-4 rounded-xl transition-all duration-300 group"
            >
              <!-- 运动类型图标 -->
              <div 
                class="flex items-center justify-center w-12 h-12 rounded-full text-white flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                :class="getExerciseColor(exercise.type)"
              >
                <component :is="getExerciseIcon(exercise.type)" class="h-6 w-6" />
              </div>
              
              <!-- 运动详情 -->
              <div class="flex-grow">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-medium text-gray-800 group-hover:text-blue-500 transition-all duration-300">
                      {{ exercise.name }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      <span>{{ formatDate(exercise.date) }}</span>
                      <span class="mx-2">|</span>
                      <span>{{ exercise.duration }} 分钟</span>
                    </p>
                  </div>
                  
                  <div class="text-end">
                    <div class="font-semibold text-rose-500">{{ exercise.calories }} 千卡</div>
                    <div class="text-sm text-gray-500">{{ exercise.distance ? `${exercise.distance} 公里` : '无距离数据' }}</div>
                  </div>
                </div>
                
                <!-- 附加信息 -->
                <div class="mt-2 flex flex-wrap gap-2">
                  <span 
                    v-for="(tag, tagIndex) in exercise.tags" 
                    :key="tagIndex"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <!-- 操作按钮 -->
                <div class="mt-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    @click="$emit('editExercise', exercise.id)" 
                    class="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button 
                    @click="$emit('deleteExercise', exercise.id)" 
                    class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          </ul>
          
          <!-- 加载更多按钮 -->
          <div v-if="hasMoreRecords" class="text-center mt-4">
            <button 
              @click="$emit('loadMoreExercises')" 
              class="px-4 py-2 text-blue-500 rounded-xl text-sm font-medium transition-all duration-300 hover:text-blue-600 border border-blue-200 hover:border-blue-300"
            >
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ClockIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentIcon,
  HeartIcon,
  FireIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline';
import { format } from 'date-fns';

const props = defineProps({
  exercises: {
    type: Array,
    default: () => ([
      {
        id: 1,
        name: '慢跑',
        type: 'running',
        date: new Date('2023-06-10'),
        duration: 45,
        distance: 5.2,
        calories: 320,
        tags: ['户外', '有氧', '初级']
      },
      {
        id: 2,
        name: '力量训练',
        type: 'strength',
        date: new Date('2023-06-09'),
        duration: 60,
        distance: null,
        calories: 450,
        tags: ['室内', '无氧', '中级']
      },
      {
        id: 3,
        name: '游泳',
        type: 'swimming',
        date: new Date('2023-06-07'),
        duration: 30,
        distance: 1.2,
        calories: 280,
        tags: ['有氧', '中级']
      }
    ])
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  hasMoreRecords: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['showHistory', 'showExerciseForm', 'editExercise', 'deleteExercise', 'loadMoreExercises']);

// 格式化日期
function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

// 根据运动类型获取图标
function getExerciseIcon(type) {
  const icons = {
    running: BoltIcon,
    walking: ArrowTrendingUpIcon,
    cycling: BoltIcon,
    swimming: BoltIcon,
    strength: FireIcon,
    yoga: HeartIcon,
    other: HeartIcon
  };
  
  return icons[type] || HeartIcon;
}

// 根据运动类型获取颜色
function getExerciseColor(type) {
  const colors = {
    running: 'bg-blue-500',
    walking: 'bg-green-500',
    cycling: 'bg-indigo-500',
    swimming: 'bg-cyan-500',
    strength: 'bg-orange-500',
    yoga: 'bg-purple-500',
    other: 'bg-gray-500'
  };
  
  return colors[type] || 'bg-gray-500';
}
</script>

<style scoped>
.card-header {
  @apply flex flex-wrap justify-between items-center p-6;
}

.card-body {
  @apply p-4;
}
</style> 