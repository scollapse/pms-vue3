<template>
  <div class="card shadow-lg rounded-xl p-4 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div class="card-header flex justify-between items-center mb-4">
      <h3 class="font-medium text-xl text-gray-800">周运动趋势</h3>
      <div class="flex flex-wrap gap-2">
        <button @click="$emit('showExerciseForm')" 
                class="px-4 py-2 bg-emerald-50 text-emerald-500 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-emerald-100 flex items-center shadow-sm hover:shadow">
          <PlusIcon class="w-4 h-4 mr-1.5" />
          添加记录
        </button>
        <button 
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
          :class="chartType === 'duration' ? 'bg-blue-50 text-blue-500 shadow-sm' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'"
          @click="switchChartType('duration')">
          <ClockIcon class="w-4 h-4 mr-1.5" />
          时长
        </button>
        <button 
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
          :class="chartType === 'calories' ? 'bg-rose-50 text-rose-500 shadow-sm' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'"
          @click="switchChartType('calories')">
          <FireIcon class="w-4 h-4 mr-1.5" />
          热量
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
      
      <!-- 趋势图表 (使用ECharts) -->
      <div v-else class="h-64">
        <v-chart class="chart" :option="chartOption" :autoresize="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { PlusIcon, ClockIcon, FireIcon } from '@heroicons/vue/24/outline';

// 注册必要的ECharts组件
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
]);

const props = defineProps({
  weeklyData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['showExerciseForm']);

// 图表类型（时长/热量）
const chartType = ref('duration');

// 切换图表类型
function switchChartType(type) {
  chartType.value = type;
}

// 星期几标签
const weekdays = computed(() => {
  return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
});

// 图表配置
const chartOption = computed(() => {
  const isDuration = chartType.value === 'duration';
  const data = isDuration ? props.weeklyData.durations : props.weeklyData.calories;
  
  // 图表颜色配置
  const colorMap = {
    duration: {
      primary: '#3b82f6',
      secondary: '#93c5fd',
      barBg: new Array(7).fill('#3b82f680')
    },
    calories: {
      primary: '#ef4444',
      secondary: '#fca5a5',
      barBg: new Array(7).fill('#ef444480')
    }
  };
  
  const colors = isDuration ? colorMap.duration : colorMap.calories;
  
  // 为每个柱子创建不同透明度的颜色
  const barColors = [];
  for (let i = 0; i < 7; i++) {
    if (data[i] > 0) {
      barColors.push({
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          {offset: 0, color: isDuration ? '#60a5fa' : '#f87171'},  // 顶部颜色
          {offset: 1, color: isDuration ? '#3b82f6' : '#ef4444'}   // 底部颜色
        ]
      });
    } else {
      // 没有数据的柱子使用淡色
      barColors.push('rgba(229, 231, 235, 0.5)');
    }
  }
  
  return {
    color: [colors.primary],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      borderRadius: 8,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 10,
      shadowOffsetY: 5,
      textStyle: {
        color: '#333',
        fontSize: 12
      },
      formatter: (params) => {
        const param = params[0];
        const value = param.value;
        if (value === 0) return '';
        
        const unit = isDuration ? '分钟' : '卡路里';
        return `
          <div style="padding: 6px 10px;">
            <div style="font-weight: 500; margin-bottom: 6px;">${param.name}</div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${colors.primary}; margin-right: 6px;"></span>
              <span style="font-weight: 600;">${value} ${unit}</span>
            </div>
          </div>
        `;
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: isDuration ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%', 
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weekdays.value,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 12
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: isDuration ? '时长 (分钟)' : '热量 (卡路里)',
      nameTextStyle: {
        color: '#999',
        fontSize: 12,
        align: 'right'
      },
      max: function(value) {
        // 计算y轴最大值，确保图表高度适中
        const defaultMax = isDuration ? 120 : 800;
        return Math.max(defaultMax, value.max * 1.2);
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.05)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: isDuration ? '运动时长' : '消耗热量',
        type: 'bar',
        barWidth: '40%',
        barGap: '10%',
        data: data,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params) => {
            return barColors[params.dataIndex];
          },
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 4,
          shadowOffsetY: 2
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10,
            borderWidth: 0
          }
        },
        label: {
          show: true,
          position: 'top',
          distance: 5,
          color: '#666',
          fontSize: 12,
          formatter: (params) => {
            return params.value > 0 ? params.value : '';
          }
        },
        animationDelay: function (idx) {
          return idx * 100;
        }
      }
    ],
    animation: true,
    animationThreshold: 2000,
    animationDuration: 1000,
    animationEasing: 'elasticOut'
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>