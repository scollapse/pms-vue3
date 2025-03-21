<template>
  <div class="px-6 py-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- 页面顶部操作栏 -->
    <div class="mb-6 flex justify-between items-center">
      <!-- 历史记录按钮 -->
      <button @click="showHistory" 
              class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-100 hover:border-blue-200 bg-white shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2">
        <ClockIcon class="h-5 w-5 text-blue-400" />
        历史记录
            </button>
            
      <!-- 日期选择器 -->
      <div class="relative flex items-center gap-3">
        <button @click="setPreviousDate" 
                class="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
          <ChevronLeftIcon class="h-5 w-5" />
                </button>
        <flat-pickr 
          v-model="selectedDate"
          :config="flatpickrConfig"
          class="px-4 py-2 rounded-xl flex items-center gap-2 text-gray-700 font-medium border border-gray-100 hover:border-blue-200 bg-white shadow-sm hover:shadow transition-all duration-300"
        >
          <template #default>
            <button class="flex items-center gap-2">
              <CalendarIcon class="h-5 w-5 text-blue-400" />
              <span>{{ formatDate(currentDate) }}</span>
              <ChevronDownIcon class="h-4 w-4 text-gray-400" />
              </button>
            </template>
        </flat-pickr>
        <button @click="setNextDate" 
                class="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
          <ChevronRightIcon class="h-5 w-5" />
        </button>
              </div>

      <!-- 运动记录按钮 -->
      <button @click="showExerciseForm" 
              class="px-4 py-2 rounded-xl text-gray-700 font-medium border border-gray-100 hover:border-blue-200 bg-white shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2">
        <PlusIcon class="h-5 w-5 text-blue-400" />
        添加运动
      </button>
              </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 gap-6">
      <!-- 第一行：健康指标卡片和运动统计 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 健康指标卡片 -->
        <div class="lg:col-span-6">
          <HealthMetricsCards
            :weight="currentRecord ? currentRecord.weight : 0"
            :body-fat="currentRecord ? currentRecord.bodyFat : 0"
            :weight-trend="weightTrend"
            :body-fat-trend="bodyFatTrend"
            :height="height"
          />
        </div>

        <!-- 运动统计 -->
        <div class="lg:col-span-6">
          <ExerciseStats
                :stats="exerciseStats"
            :loading="exerciseLoading"
          />
        </div>
      </div>

      <!-- 第二行：趋势图表和周运动趋势 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 趋势图表 -->
        <div class="lg:col-span-6">
          <TrendChart
            :chart-type="chartType"
            :chart-dates="chartDates"
            :weight-chart-points="weightChartPoints"
            :body-fat-chart-points="bodyFatChartPoints"
            :weight-chart-path="weightChartPath"
            :body-fat-chart-path="bodyFatChartPath"
            :loading="chartLoading"
            @show-analysis="showAnalysis"
            @change-chart-type="changeChartType"
          />
                </div>

        <!-- 周运动趋势 -->
        <div class="lg:col-span-6">
          <ExerciseTrend
            :weekly-data="{
              durations: weeklyExerciseData.map(day => day.duration),
              calories: weeklyExerciseData.map(day => day.calories)
            }"
            :loading="exerciseLoading"
            @showExerciseForm="showExerciseForm"
          />
                      </div>
                    </div>

      <!-- 第三行：目标卡片、其他指标和运动记录 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 目标进度 -->
        <div class="lg:col-span-4">
          <GoalProgress
            :current-weight="currentRecord ? currentRecord.weight : 0"
            :target-weight="targetWeight"
            :start-weight="startWeight"
            :start-date="startDate"
            :projected-date="projectedDate"
            :progress-percentage="progressPercentage"
          />
                    </div>

        <!-- 其他指标 -->
        <div class="lg:col-span-4">
          <OtherIndicators
            :muscle-mass="currentRecord ? currentRecord.muscleMass : 0"
            :water-rate="currentRecord ? currentRecord.waterRate : 0"
            :bone-mass="currentRecord ? currentRecord.boneMass : 0"
          />
                    </div>

        <!-- 运动记录 -->
        <div class="lg:col-span-4">
          <ExerciseRecords
            :exercises="exerciseRecords"
            :loading="exerciseLoading" 
            :loading-more="loadingMoreExercises"
            :has-more-records="hasMoreExerciseRecords"
            @showHistory="showExerciseHistory"
            @showExerciseForm="showExerciseForm"
            @editExercise="editExercise"
            @deleteExercise="deleteExercise"
            @loadMoreExercises="loadMoreExercises"
          />
                          </div>
                        </div>
                      </div>

    <!-- 添加记录悬浮按钮 -->
    <button 
      @click="showAddForm"
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center group z-50">
      <PlusIcon class="h-7 w-7" />
      <span class="ripple-container absolute inset-0 overflow-hidden rounded-full">
        <span class="ripple absolute bg-white opacity-20 rounded-full transform scale-0 origin-center"></span>
      </span>
    </button>

    <!-- 健康数据记录模态框 -->
    <ModalForm 
      v-model="showHealthModal" 
      :title="isEditMode ? '编辑健康记录' : '添加健康记录'" 
      size="lg" 
      :confirm-text="isEditMode ? '保存修改' : '保存记录'"
      :loading="isSubmitting"
      @confirm="saveHealthData">
      <HealthRecordForm 
        :initial-data="editingRecord" 
        :is-edit="isEditMode"
        @submit="saveHealthData"
        @cancel="closeHealthModal" 
      />
    </ModalForm>

    <!-- 运动记录模态框 -->
    <ModalForm 
      v-model="showExerciseModal" 
      :title="isEditingExercise ? '编辑运动记录' : '添加运动记录'" 
      size="lg" 
      :confirm-text="isEditingExercise ? '保存修改' : '保存记录'"
      :loading="isSubmittingExercise"
      @confirm="saveExerciseData">
      <ExerciseForm 
        :initial-data="editingExerciseRecord" 
        :is-edit="isEditingExercise"
        @submit="saveExerciseData"
        @cancel="closeExerciseModal" 
      />
    </ModalForm>

    <!-- 历史记录模态框 -->
    <ModalForm 
      v-model="showHistoryModal" 
      title="健康记录历史" 
      size="xl">
      <HealthHistory 
        :records="healthRecords"
        :loading="historyLoading"
        @edit="editHealthRecord"
        @delete="deleteHealthRecord"
      />
    </ModalForm>

    <!-- 运动历史模态框 -->
    <ModalForm 
      v-model="showExerciseHistoryModal" 
      title="运动记录历史" 
      size="xl">
      <ExerciseHistory 
        :records="exerciseHistoryRecords"
        :loading="exerciseHistoryLoading"
        @edit="editExerciseHistoryRecord"
        @delete="deleteExerciseHistoryRecord"
      />
    </ModalForm>

    <!-- 分析模态框 -->
    <ModalForm 
      v-model="showAnalysisModal" 
      :title="`${chartType === 'weight' ? '体重' : '体脂率'}数据分析`" 
      size="xl">
      <DataAnalysis 
        :chart-type="chartType"
        :data="chartType === 'weight' ? weightAnalysisData : bodyFatAnalysisData"
        :loading="analysisLoading"
      />
    </ModalForm>

    <!-- 页面过渡效果 -->
    <Transition 
      name="page-transition" 
      appear 
      mode="out-in">
      <div v-if="pageLoading" class="page-loading">
        <div class="page-loading-spinner"></div>
        <p class="page-loading-text">加载健康数据...</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  CalendarIcon, 
  ClockIcon, 
  PlusIcon 
} from '@heroicons/vue/24/outline';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { format, addDays, subDays } from 'date-fns';

// 健康指标卡片组件
import HealthMetricsCards from './components/HealthMetricsCards.vue';
// 趋势图表组件
import TrendChart from './components/TrendChart.vue';
// 目标进度组件
import GoalProgress from './components/GoalProgress.vue';
// 运动统计组件
import ExerciseStats from './components/ExerciseStats.vue';
// 运动趋势组件
import ExerciseTrend from './components/ExerciseTrend.vue';
// 运动记录组件
import ExerciseRecords from './components/ExerciseRecords.vue';
// 其他指标组件
import OtherIndicators from './components/OtherIndicators.vue';

// 导入模态框和表单组件
import ModalForm from '../../../components/ModalForm.vue';
import HealthRecordForm from './components/HealthRecordForm.vue';
import ExerciseForm from './components/ExerciseForm.vue';
import HealthHistory from './components/HealthHistory.vue';
import ExerciseHistory from './components/ExerciseHistory.vue';
import DataAnalysis from './components/DataAnalysis.vue';

// 导入健康数据管理模块
import { useHealthData } from './composables/useHealthData';

const { 
  currentDate, setCurrentDate, 
  currentRecord, healthRecords, chartType, chartDates,
  weightChartPoints, bodyFatChartPoints, weightChartPath, bodyFatChartPath,
  weightTrend, bodyFatTrend, height, targetWeight, startWeight, startDate,
  projectedDate, progressPercentage, saveHealthRecord, deleteRecord, loadHealthData,
  weeklyExerciseStats, weeklyExerciseData, recentExercises
} = useHealthData();

// 页面加载状态
const pageLoading = ref(true);

// 选择日期
const selectedDate = ref(new Date());

// flatpickr配置
const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  onChange: (selectedDates) => {
    if (selectedDates.length > 0) {
      setCurrentDate(selectedDates[0]);
    }
  }
};

// 图表加载状态
const chartLoading = ref(false);

// 运动数据
const exerciseLoading = ref(false);
const loadingMoreExercises = ref(false);
const hasMoreExerciseRecords = ref(true);

// 运动统计数据
const exerciseStats = computed(() => weeklyExerciseStats.value);

// 运动记录
const exerciseRecords = computed(() => recentExercises.value);

// 模态框状态
const showHealthModal = ref(false);
const showExerciseModal = ref(false);
const showHistoryModal = ref(false);
const showExerciseHistoryModal = ref(false);
const showAnalysisModal = ref(false);

// 编辑状态
const isEditMode = ref(false);
const isEditingExercise = ref(false);
const editingRecord = ref({});
const editingExerciseRecord = ref({});

// 提交状态
const isSubmitting = ref(false);
const isSubmittingExercise = ref(false);

// 历史记录状态
const historyLoading = ref(false);
const exerciseHistoryLoading = ref(false);
const exerciseHistoryRecords = ref([]);

// 分析数据
const analysisLoading = ref(false);
const weightAnalysisData = ref(null);
const bodyFatAnalysisData = ref(null);

// 更新日期
function setPreviousDate() {
  const newDate = subDays(currentDate.value, 1);
  selectedDate.value = newDate;
  setCurrentDate(newDate);
}

function setNextDate() {
  const newDate = addDays(currentDate.value, 1);
  selectedDate.value = newDate;
  setCurrentDate(newDate);
}

// 格式化日期显示
function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

// 切换图表类型
function changeChartType(type) {
  chartType.value = type;
}

// 显示分析
function showAnalysis() {
  analysisLoading.value = true;
  showAnalysisModal.value = true;
  
  // 模拟加载分析数据
  setTimeout(() => {
    if (chartType.value === 'weight') {
      // 模拟体重分析数据
      weightAnalysisData.value = {
        trend: '下降',
        weeklyAverage: 75.4,
        monthlyAverage: 76.2,
        lowestValue: 74.8,
        highestValue: 77.5,
        volatility: 2.7,
        weeklyChange: -0.8,
        monthlyChange: -1.7,
        predictions: [75.1, 74.8, 74.5, 74.2]
      };
    } else {
      // 模拟体脂率分析数据
      bodyFatAnalysisData.value = {
        trend: '稳定',
        weeklyAverage: 18.9,
        monthlyAverage: 19.4,
        lowestValue: 18.5,
        highestValue: 20.1,
        volatility: 1.6,
        weeklyChange: -0.3,
        monthlyChange: -0.5,
        predictions: [18.8, 18.7, 18.6, 18.6]
      };
    }
    
    analysisLoading.value = false;
  }, 1000);
}

// 显示历史记录
function showHistory() {
  historyLoading.value = true;
  showHistoryModal.value = true;
  
  // 在实际应用中，这里会加载更多历史记录
  setTimeout(() => {
    historyLoading.value = false;
  }, 800);
}

// 显示运动历史
function showExerciseHistory() {
  exerciseHistoryLoading.value = true;
  showExerciseHistoryModal.value = true;
  
  // 模拟加载运动历史记录
  setTimeout(() => {
    // 生成模拟数据
    exerciseHistoryRecords.value = [
      { id: 1, date: '2023-05-01', type: 'run', duration: 45, calories: 320, intensity: 2, icon: 'run' },
      { id: 2, date: '2023-05-02', type: 'cycle', duration: 60, calories: 450, intensity: 3, icon: 'cycle' },
      { id: 3, date: '2023-05-04', type: 'swim', duration: 30, calories: 220, intensity: 2, icon: 'swim' },
      { id: 4, date: '2023-05-05', type: 'weightlifting', duration: 60, calories: 450, intensity: 2, icon: 'weightlifting' },
      { id: 5, date: '2023-05-06', type: 'basketball', duration: 90, calories: 680, intensity: 3, icon: 'basketball' },
      { id: 6, date: '2023-05-07', type: 'yoga', duration: 45, calories: 320, intensity: 1, icon: 'yoga' }
    ];
    
    exerciseHistoryLoading.value = false;
  }, 800);
}

// 显示添加表单
function showAddForm() {
  isEditMode.value = false;
  editingRecord.value = { date: currentDate.value };
  showHealthModal.value = true;
}

// 显示运动表单
function showExerciseForm(exercise = null) {
  if (exercise) {
    isEditingExercise.value = true;
    editingExerciseRecord.value = { ...exercise };
  } else {
    isEditingExercise.value = false;
    editingExerciseRecord.value = { date: currentDate.value };
  }
  
  showExerciseModal.value = true;
}

// 关闭健康模态框
function closeHealthModal() {
  showHealthModal.value = false;
  nextTick(() => {
    editingRecord.value = {};
    isEditMode.value = false;
  });
}

// 关闭运动模态框
function closeExerciseModal() {
  showExerciseModal.value = false;
  nextTick(() => {
    editingExerciseRecord.value = {};
    isEditingExercise.value = false;
  });
}

// 保存健康数据
async function saveHealthData(data) {
  isSubmitting.value = true;
  
  try {
    await saveHealthRecord(data);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 关闭模态框
    closeHealthModal();
    
    // 显示成功消息
    // ...
  } catch (error) {
    console.error('保存健康数据时出错:', error);
  } finally {
    isSubmitting.value = false;
  }
}

// 保存运动记录
async function saveExerciseData(data) {
  isSubmittingExercise.value = true;
  
  try {
    // 在真实应用中，这里会调用保存运动记录的API
    console.log('保存运动记录:', data);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 关闭模态框
    closeExerciseModal();
    
    // 显示成功消息
    // ...
  } catch (error) {
    console.error('保存运动记录时出错:', error);
  } finally {
    isSubmittingExercise.value = false;
  }
}

// 编辑健康记录
function editHealthRecord(record) {
  isEditMode.value = true;
  editingRecord.value = { ...record };
  showHealthModal.value = true;
  showHistoryModal.value = false;
}

// 删除健康记录
async function deleteHealthRecord(id) {
  try {
    await deleteRecord(id);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 如果在历史记录页面中，从列表中移除该记录
    healthRecords.value = healthRecords.value.filter(record => record.id !== id);
    
    // 显示成功消息
    // ...
  } catch (error) {
    console.error('删除健康记录时出错:', error);
  }
}

// 编辑运动记录
function editExercise(id) {
  const exercise = exerciseRecords.value.find(r => r.id === id);
  if (exercise) {
    showExerciseForm(exercise);
  }
}

// 编辑运动历史记录
function editExerciseHistoryRecord(record) {
  isEditingExercise.value = true;
  editingExerciseRecord.value = { ...record };
  showExerciseModal.value = true;
  showExerciseHistoryModal.value = false;
}

// 删除运动历史记录
function deleteExerciseHistoryRecord(id) {
  // 在实际应用中，这里会调用API删除记录
  exerciseHistoryRecords.value = exerciseHistoryRecords.value.filter(record => record.id !== id);
}

// 删除运动记录
function deleteExercise(id) {
  // 在实际应用中，这里会调用API删除记录
  console.log('删除运动记录:', id);
}

// 加载更多运动记录
function loadMoreExercises() {
  loadingMoreExercises.value = true;
  
  // 模拟加载
  setTimeout(() => {
    // TODO: 实际项目中应该调用API加载更多记录
    hasMoreExerciseRecords.value = false;
    loadingMoreExercises.value = false;
  }, 1000);
}

// 初始化
onMounted(async () => {
  // 显示页面加载状态
  pageLoading.value = true;
  
  try {
    // 加载健康数据
    await loadHealthData();
    
    // 模拟其他数据加载
    await new Promise(resolve => setTimeout(resolve, 800));
    
  } catch (error) {
    console.error('加载数据时出错:', error);
  } finally {
    // 隐藏页面加载状态
    pageLoading.value = false;
  }
});

// 添加波纹效果
document.addEventListener('click', function(e) {
  const btn = e.target.closest('button');
  if (btn && btn.querySelector('.ripple-container')) {
    const ripple = btn.querySelector('.ripple');
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const pos = btn.getBoundingClientRect();
    const x = e.clientX - pos.left - size / 2;
    const y = e.clientY - pos.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    ripple.classList.remove('animate');
    // 触发重排
    void ripple.offsetWidth;
    ripple.classList.add('animate');
  }
});
</script>

<style scoped>
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  background-color: rgba(255, 255, 255, 0.3);
}

@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

.ripple.animate {
  animation: ripple 0.6s linear;
}

/* 页面过渡效果 */
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.page-loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

.page-loading-text {
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.5s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>
