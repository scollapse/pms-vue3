<template>
  <div class="card shadow-lg rounded-xl p-4 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div class="card-header flex justify-between items-center mb-4">
      <h3 class="font-medium text-xl text-gray-800">周数据趋势</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
          :class="chartType === 'weight' ? 'bg-indigo-50 text-indigo-500 shadow-sm' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'"
          @click="$emit('changeChartType', 'weight')">
          <ScaleIcon class="w-4 h-4 mr-1.5" />
          体重
        </button>
        <button 
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
          :class="chartType === 'bodyFat' ? 'bg-amber-50 text-amber-500 shadow-sm' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'"
          @click="$emit('changeChartType', 'bodyFat')">
          <ChartPieIcon class="w-4 h-4 mr-1.5" />
          体脂率
        </button>
        <button @click="$emit('showAnalysis')" 
                class="px-4 py-2 bg-indigo-50 text-indigo-500 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-indigo-100 flex items-center shadow-sm hover:shadow">
          <ChartBarIcon class="w-4 h-4 mr-1.5" />
          数据分析
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- 加载状态 -->
      <div v-if="loading" class="h-64 flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { ChartBarIcon, ScaleIcon, ChartPieIcon } from '@heroicons/vue/24/outline';

// 注册必要的ECharts组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
]);

const props = defineProps({
  chartType: {
    type: String,
    required: true
  },
  chartTitle: {
    type: String,
    required: false,
    default: '周数据趋势'
  },
  chartDates: {
    type: Array,
    required: true
  },
  weightChartPoints: {
    type: String,
    required: true
  },
  bodyFatChartPoints: {
    type: String,
    required: true
  },
  weightChartPath: {
    type: String,
    required: true
  },
  bodyFatChartPath: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['showAnalysis', 'changeChartType']);

// 解析点数据为数值
const parseData = (chartPoints, isWeight) => {
  // 如果使用原始SVG点，需要转换到对应的数值
  if (!chartPoints || typeof chartPoints !== 'string') return [];
  
  const points = chartPoints.split(' ')
    .filter(point => point.includes(','))
    .map(point => {
      const [_, y] = point.split(',').map(Number);
      // 将SVG坐标值转换为实际数值
      const value = isWeight 
        ? (85 - (y / 240) * 20).toFixed(1) 
        : (30 - (y / 240) * 20).toFixed(1);
      return parseFloat(value);
    });
  
  return points;
};

// 获取体重数据
const weightData = computed(() => {
  return parseData(props.weightChartPoints, true);
});

// 获取体脂率数据
const bodyFatData = computed(() => {
  return parseData(props.bodyFatChartPoints, false);
});

// 图表配置
const chartOption = computed(() => {
  const isWeight = props.chartType === 'weight';
  const data = isWeight ? weightData.value : bodyFatData.value;
  
  // 图表颜色配置
  const colorMap = {
    weight: {
      primary: '#6366f1',
      gradient: new Array(2).fill('rgba(99, 102, 241, 0.2)'),
      area: new Array(2).fill('rgba(99, 102, 241, 0.1)')
    },
    bodyFat: {
      primary: '#f59e0b',
      gradient: new Array(2).fill('rgba(245, 158, 11, 0.2)'),
      area: new Array(2).fill('rgba(245, 158, 11, 0.1)')
    }
  };
  
  const colors = isWeight ? colorMap.weight : colorMap.bodyFat;
  
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
        const unit = isWeight ? 'kg' : '%';
        return `
          <div style="padding: 6px 10px;">
            <div style="font-weight: 500; margin-bottom: 6px;">${param.name}</div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${colors.primary}; margin-right: 6px;"></span>
              <span style="font-weight: 600;">${value}${unit}</span>
            </div>
          </div>
        `;
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: isWeight ? 'rgba(99, 102, 241, 0.05)' : 'rgba(245, 158, 11, 0.05)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartDates,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        margin: 12,
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
    yAxis: {
      type: 'value',
      name: isWeight ? '体重 (kg)' : '体脂率 (%)',
      nameTextStyle: {
        color: '#999',
        fontSize: 12,
        align: 'right'
      },
      min: isWeight ? 65 : 10,
      max: isWeight ? 85 : 30,
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
        name: isWeight ? '体重' : '体脂率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: true,
        lineStyle: {
          width: 3,
          shadowColor: colors.gradient,
          shadowBlur: 10
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 5
        },
        emphasis: {
          scale: true,
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.area[0] },
              { offset: 1, color: colors.area[1] }
            ]
          }
        },
        data: data,
        animationDuration: 1000,
        animationEasing: 'elasticOut',
        markPoint: {
          symbol: 'pin',
          symbolSize: 40,
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          label: {
            fontSize: 12
          },
          itemStyle: {
            color: colors.primary
          }
        }
      }
    ],
    animation: true,
    animationThreshold: 2000,
    animationDuration: 1000,
    animationDelay: function (idx) {
      return idx * 50;
    }
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>