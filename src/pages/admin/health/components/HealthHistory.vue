<template>
  <div class="health-history">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!records || records.length === 0" class="flex flex-col items-center justify-center h-64">
      <DocumentIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-500">暂无健康记录</h3>
      <p class="text-gray-400 mt-2">点击添加按钮开始记录您的健康数据</p>
    </div>
    
    <!-- 历史记录表格 -->
    <div v-else class="overflow-hidden shadow-sm rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日期
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              体重 (kg)
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              体脂率 (%)
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BMI
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              其他指标
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="record in sortedRecords" :key="record.id" 
              class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ record.date }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-sm text-gray-900">{{ record.weight }}</span>
                <WeightTrendBadge :trend="record.weightTrend" class="ml-2" />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-sm text-gray-900">{{ record.bodyFat }}</span>
                <WeightTrendBadge :trend="record.bodyFatTrend" class="ml-2" is-body-fat />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ calculateBMI(record.weight, record.height).toFixed(1) }}</div>
              <div class="text-xs text-gray-500">{{ getBmiStatus(calculateBMI(record.weight, record.height)) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="showDetails(record)" class="text-blue-500 hover:text-blue-700 text-sm">
                查看详情
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-3">
                <button @click="$emit('edit', record)" class="text-indigo-600 hover:text-indigo-900">
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button @click="confirmDelete(record.id)" class="text-red-600 hover:text-red-900">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 记录详情抽屉 -->
    <div 
      v-if="showDrawer" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
      @click="showDrawer = false">
    </div>
    
    <div 
      v-if="showDrawer" 
      class="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto transform transition-transform z-50"
      :class="showDrawer ? 'translate-x-0' : 'translate-x-full'"
      @click.stop>
      
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">记录详情</h3>
        <button @click="showDrawer = false" class="text-gray-400 hover:text-gray-500">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
      
      <div v-if="selectedRecord" class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">日期</div>
            <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.date }}</div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">体重</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.weight }} kg</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">体脂率</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.bodyFat }}%</div>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">肌肉量</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.muscleMass || '-' }} kg</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">水分率</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.waterRate || '-' }}%</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">骨量</div>
              <div class="mt-1 text-lg font-medium text-gray-900">{{ selectedRecord.boneMass || '-' }} kg</div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">BMI</div>
            <div class="mt-1 text-lg font-medium text-gray-900">
              {{ calculateBMI(selectedRecord.weight, selectedRecord.height).toFixed(1) }}
              <span class="ml-2 text-sm font-normal text-gray-500">
                {{ getBmiStatus(calculateBMI(selectedRecord.weight, selectedRecord.height)) }}
              </span>
            </div>
          </div>
          
          <div v-if="selectedRecord.notes" class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-500">备注</div>
            <div class="mt-1 text-base text-gray-900">{{ selectedRecord.notes }}</div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            @click="$emit('edit', selectedRecord); showDrawer = false" 
            class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium transition-all hover:bg-indigo-100">
            编辑记录
          </button>
          <button 
            @click="confirmDelete(selectedRecord.id); showDrawer = false" 
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
          <p class="text-gray-700">确定要删除这条健康记录吗？此操作无法撤销。</p>
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
import { DocumentIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import WeightTrendBadge from './WeightTrendBadge.vue';

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

// 抽屉状态
const showDrawer = ref(false);
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
  showDrawer.value = true;
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

// 计算BMI
function calculateBMI(weight, height) {
  if (!weight || !height) return 0;
  
  // 将身高从厘米转换为米
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// 获取BMI状态
function getBmiStatus(bmi) {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '超重';
  return '肥胖';
}
</script>

<style scoped>
/* 抽屉过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style> 