<template>
  <div class="exercise-history">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!records || records.length === 0" class="flex flex-col items-center justify-center h-64">
      <DocumentIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-500">暂无运动记录</h3>
      <p class="text-gray-400 mt-2">点击添加按钮开始记录您的运动数据</p>
    </div>
    
    <!-- 历史记录列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="record in sortedRecords" :key="record.id" 
          class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
        <div class="flex items-center p-4 border-b border-gray-100">
          <div class="flex-shrink-0 mr-3">
            <div :class="`exercise-icon ${record.type}`">
              <component :is="getExerciseIcon(record.type)" class="h-5 w-5" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-medium text-gray-900 truncate">
              {{ getExerciseTypeName(record.type) }}
            </h4>
            <p class="text-sm text-gray-500">
              {{ record.date }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="$emit('edit', record)" class="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50">
              <PencilIcon class="h-4 w-4" />
            </button>
            <button @click="confirmDelete(record.id)" class="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50">
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div class="p-4 grid grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">时长</span>
            <span class="text-lg font-medium text-gray-900">{{ record.duration }} 分钟</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">热量</span>
            <span class="text-lg font-medium text-gray-900">{{ record.calories }} 卡</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">强度</span>
            <span class="text-lg font-medium text-gray-900">{{ getIntensityLevel(record.intensity) }}</span>
          </div>
        </div>
        
        <div v-if="record.description" class="px-4 pb-4">
          <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            {{ record.description }}
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-100 flex justify-end">
          <button @click="showDetails(record)" class="text-blue-500 hover:text-blue-700 text-sm flex items-center">
            <InformationCircleIcon class="h-4 w-4 mr-1" /> 查看详情
          </button>
        </div>
      </div>
    </div>
    
    <!-- 记录详情对话框 -->
    <div 
      v-if="showDetailsModal" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
      <div 
        class="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full transform transition-all"
        @click.stop>
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <div class="flex items-center">
            <div :class="`exercise-icon ${selectedRecord.type} mr-3`">
              <component :is="getExerciseIcon(selectedRecord.type)" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-medium text-gray-900">{{ getExerciseTypeName(selectedRecord.type) }}</h3>
          </div>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <div v-if="selectedRecord" class="p-5 space-y-5">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">日期</div>
            <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.date }}</div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">时长</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.duration }} 分钟</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">热量消耗</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.calories }} 卡路里</div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">运动强度</div>
              <div class="mt-1 text-lg font-medium text-gray-900">
                {{ getIntensityLevel(selectedRecord.intensity) }}
                <span class="ml-2 text-sm font-normal text-gray-500">
                  {{ getIntensityDescription(selectedRecord.intensity) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedRecord.description" class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">详细描述</div>
            <div class="mt-1 text-base text-gray-900">{{ selectedRecord.description }}</div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">运动效果</div>
            <div class="mt-1 text-base text-gray-900">
              {{ getExerciseEffect(selectedRecord.type, selectedRecord.duration, selectedRecord.intensity) }}
            </div>
          </div>
        </div>
        
        <div class="px-5 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="$emit('edit', selectedRecord); showDetailsModal = false" 
            class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium transition-all hover:bg-indigo-100">
            编辑记录
          </button>
          <button 
            @click="confirmDelete(selectedRecord.id); showDetailsModal = false" 
            class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-all hover:bg-red-100">
            删除记录
          </button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div 
      v-if="showDeleteConfirm" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
      <div 
        class="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full transform transition-all"
        @click.stop>
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">确认删除</h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700">确定要删除这条运动记录吗？此操作无法撤销。</p>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="showDeleteConfirm = false" 
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
            取消
          </button>
          <button 
            @click="deleteRecord" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition-all hover:bg-red-700">
            删除
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  DocumentIcon, PencilIcon, TrashIcon, XMarkIcon, InformationCircleIcon,
  FireIcon, ClockIcon, HeartIcon, SparklesIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete']);

// 详情模态框状态
const showDetailsModal = ref(false);
const selectedRecord = ref(null);

// 删除确认状态
const showDeleteConfirm = ref(false);
const recordIdToDelete = ref(null);

// 按日期排序的记录
const sortedRecords = computed(() => {
  if (!props.records || props.records.length === 0) return [];
  
  return [...props.records].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

// 显示记录详情
function showDetails(record) {
  selectedRecord.value = record;
  showDetailsModal.value = true;
}

// 确认删除
function confirmDelete(id) {
  recordIdToDelete.value = id;
  showDeleteConfirm.value = true;
}

// 删除记录
function deleteRecord() {
  emit('delete', recordIdToDelete.value);
  showDeleteConfirm.value = false;
  recordIdToDelete.value = null;
}

// 获取运动类型名称
function getExerciseTypeName(type) {
  const typeMap = {
    run: '跑步',
    walk: '走路',
    cycle: '骑行',
    swim: '游泳',
    weightlifting: '力量训练',
    yoga: '瑜伽',
    basketball: '篮球',
    football: '足球',
    tennis: '网球',
    dance: '舞蹈',
    hiit: '高强度间歇训练',
    other: '其他运动'
  };
  
  return typeMap[type] || '运动';
}

// 获取运动图标组件
function getExerciseIcon(type) {
  // 这里实际应用中可能需要根据不同类型返回不同的图标组件
  // 为了简单，这里使用 HeroIcons 提供的通用图标
  const iconMap = {
    run: FireIcon,
    walk: ClockIcon,
    cycle: SparklesIcon,
    swim: SparklesIcon,
    weightlifting: SparklesIcon,
    yoga: HeartIcon,
    basketball: FireIcon,
    football: FireIcon,
    tennis: FireIcon,
    dance: HeartIcon,
    hiit: FireIcon,
    other: SparklesIcon
  };
  
  return iconMap[type] || SparklesIcon;
}

// 获取强度级别文本
function getIntensityLevel(intensity) {
  if (intensity === 1) return '轻度';
  if (intensity === 2) return '中度';
  if (intensity === 3) return '高度';
  return '未知';
}

// 获取强度详细描述
function getIntensityDescription(intensity) {
  if (intensity === 1) return '低心率区间';
  if (intensity === 2) return '有氧燃脂';
  if (intensity === 3) return '高强度间歇';
  return '';
}

// 获取运动效果描述
function getExerciseEffect(type, duration, intensity) {
  // 根据运动类型、时长和强度生成效果描述
  let effect = '';
  
  // 根据类型添加基础描述
  if (['run', 'walk', 'cycle'].includes(type)) {
    effect += '有氧运动，提高心肺功能，';
  } else if (['weightlifting', 'hiit'].includes(type)) {
    effect += '力量训练，增强肌肉强度，';
  } else if (['yoga', 'dance'].includes(type)) {
    effect += '增强身体柔韧性，改善姿态，';
  } else if (['basketball', 'football', 'tennis'].includes(type)) {
    effect += '球类运动，提高协调性和反应能力，';
  } else if (type === 'swim') {
    effect += '全身性运动，改善肌肉均衡发展，';
  }
  
  // 根据时长添加描述
  if (duration < 30) {
    effect += '短时运动有助于提神醒脑，';
  } else if (duration < 60) {
    effect += '适中时长有助于基础代谢提升，';
  } else {
    effect += '长时间锻炼提高耐力，';
  }
  
  // 根据强度添加描述
  if (intensity === 1) {
    effect += '轻度运动有助于放松身心。';
  } else if (intensity === 2) {
    effect += '中度强度促进脂肪燃烧。';
  } else {
    effect += '高强度训练能显著提高身体素质。';
  }
  
  return effect;
}
</script>

<style scoped>
.exercise-icon {
  @apply flex items-center justify-center h-10 w-10 rounded-full;
}

.exercise-icon.run { @apply bg-red-100 text-red-600; }
.exercise-icon.walk { @apply bg-green-100 text-green-600; }
.exercise-icon.cycle { @apply bg-blue-100 text-blue-600; }
.exercise-icon.swim { @apply bg-cyan-100 text-cyan-600; }
.exercise-icon.weightlifting { @apply bg-purple-100 text-purple-600; }
.exercise-icon.yoga { @apply bg-amber-100 text-amber-600; }
.exercise-icon.basketball { @apply bg-orange-100 text-orange-600; }
.exercise-icon.football { @apply bg-emerald-100 text-emerald-600; }
.exercise-icon.tennis { @apply bg-lime-100 text-lime-600; }
.exercise-icon.dance { @apply bg-pink-100 text-pink-600; }
.exercise-icon.hiit { @apply bg-indigo-100 text-indigo-600; }
.exercise-icon.other { @apply bg-gray-100 text-gray-600; }
</style> 