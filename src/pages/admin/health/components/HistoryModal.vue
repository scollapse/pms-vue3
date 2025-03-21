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
            <!-- 弹窗标题 -->
            <div class="bg-white px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  历史记录
                </h3>
                <button @click="$emit('close')" 
                  class="rounded-full p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- 搜索和筛选区域 -->
            <div class="bg-gray-50 px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 日期范围选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
                  <select v-model="filter.period"
                          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3 sm:text-sm border-gray-300 rounded-md">
                    <option value="all">全部</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="quarter">本季度</option>
                    <option value="year">本年</option>
                  </select>
                </div>
                
                <!-- 搜索框 -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" v-model="filter.keyword"
                           class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md"
                           placeholder="搜索日期、指标或备注..." />
                  </div>
                </div>
              </div>
            </div>

            <!-- 表格内容区域 -->
            <div class="px-6 py-3 max-h-96 overflow-y-auto">
              <!-- 加载状态 -->
              <div v-if="loading" class="h-64 flex items-center justify-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
              
              <!-- 表格内容 -->
              <table v-else class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日期
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      体重 (kg)
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      体脂率 (%)
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BMI
                    </th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      其他指标
                    </th>
                    <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(record, index) in filteredRecords" :key="index" 
                      class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ record.date }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ record.weight }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ record.bodyFat }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ calculateBMI(record.weight, record.height) }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <button class="text-indigo-600 hover:text-indigo-900 text-sm" 
                              @click="showDetails(record)">
                        查看详情
                      </button>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-indigo-600 hover:text-indigo-900 mr-3" 
                              @click="$emit('edit', record)">
                        编辑
                      </button>
                      <button class="text-rose-600 hover:text-rose-900" 
                              @click="confirmDelete(record)">
                        删除
                      </button>
                    </td>
                  </tr>
                  
                  <!-- 无数据状态 -->
                  <tr v-if="filteredRecords.length === 0">
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                      暂无符合条件的记录
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- 分页和底部按钮 -->
            <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  共显示 
                  <span class="font-medium">{{ filteredRecords.length }}</span> 
                  条记录
                </p>
              </div>
              
              <div>
                <button @click="$emit('close')" 
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  关闭
                </button>
              </div>
            </div>
            
            <!-- 详情弹出层 -->
            <div v-if="showDetailPanel" class="fixed inset-0 z-60 overflow-y-auto" 
                 aria-labelledby="detail-title" role="dialog" aria-modal="true">
              <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
                <Transition name="fade">
                  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                       @click="showDetailPanel = false"></div>
                </Transition>
                
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <Transition name="slide-up">
                  <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <!-- 详情标题 -->
                    <div class="bg-white px-6 py-5 border-b border-gray-200">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="detail-title">
                          详细记录 - {{ selectedRecord?.date }}
                        </h3>
                        <button @click="showDetailPanel = false" 
                          class="rounded-full p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-500 transition-colors">
                          <XMarkIcon class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <!-- 详情内容 -->
                    <div class="px-6 py-5">
                      <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-sm text-gray-500">身高</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.height }} m</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">体重</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.weight }} kg</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">体脂率</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.bodyFat }}%</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">BMI</p>
                            <p class="text-lg font-medium">{{ calculateBMI(selectedRecord?.weight, selectedRecord?.height) }}</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">肌肉量</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.muscleMass }} kg</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">水分率</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.waterRate }}%</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">骨量</p>
                            <p class="text-lg font-medium">{{ selectedRecord?.boneMass }} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 按钮区域 -->
                    <div class="bg-gray-50 px-6 py-4 flex justify-end">
                      <button @click="showDetailPanel = false" 
                              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        关闭
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            
            <!-- 删除确认弹窗 -->
            <div v-if="showDeleteConfirm" class="fixed inset-0 z-60 overflow-y-auto" 
                 aria-labelledby="confirm-title" role="dialog" aria-modal="true">
              <div class="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
                <Transition name="fade">
                  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                       @click="showDeleteConfirm = false"></div>
                </Transition>
                
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <Transition name="slide-up">
                  <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-6 py-5">
                      <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 class="text-lg leading-6 font-medium text-gray-900" id="confirm-title">
                            删除记录
                          </h3>
                          <div class="mt-2">
                            <p class="text-sm text-gray-500">
                              确定要删除 {{ selectedRecord?.date }} 的记录吗？此操作无法撤销。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                      <button type="button" @click="deleteRecord"
                              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                        删除
                      </button>
                      <button type="button" @click="showDeleteConfirm = false"
                              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        取消
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { XMarkIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  records: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'edit', 'delete']);

const filter = ref({
  period: 'all',
  keyword: ''
});

const showDetailPanel = ref(false);
const showDeleteConfirm = ref(false);
const selectedRecord = ref(null);

// 筛选记录
const filteredRecords = computed(() => {
  let result = [...props.records];
  
  // 根据关键字筛选
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase();
    result = result.filter(record => 
      record.date.toLowerCase().includes(keyword) || 
      record.weight.toString().includes(keyword) ||
      record.bodyFat.toString().includes(keyword)
    );
  }
  
  // 根据时间段筛选
  if (filter.value.period !== 'all') {
    const now = new Date();
    let startDate;
    
    switch (filter.value.period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    if (startDate) {
      result = result.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= now;
      });
    }
  }
  
  // 按日期降序排序
  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 计算BMI
const calculateBMI = (weight, height) => {
  if (!weight || !height) return '-';
  const bmi = weight / (height * height);
  return bmi.toFixed(1);
};

// 显示详情
const showDetails = (record) => {
  selectedRecord.value = record;
  showDetailPanel.value = true;
};

// 确认删除
const confirmDelete = (record) => {
  selectedRecord.value = record;
  showDeleteConfirm.value = true;
};

// 删除记录
const deleteRecord = () => {
  emit('delete', selectedRecord.value);
  showDeleteConfirm.value = false;
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