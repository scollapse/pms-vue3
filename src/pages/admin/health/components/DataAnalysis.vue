<template>
  <div class="data-analysis">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- 分析内容 -->
    <div v-else-if="data" class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <!-- 左侧摘要 -->
      <div class="md:col-span-4 space-y-4">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 class="text-lg font-medium text-gray-800 mb-4">{{ title }}摘要</h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">趋势</span>
              <span :class="getTrendClass(data.trend)">{{ getTrendText(data.trend) }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-t border-gray-100">
              <span class="text-gray-600">本周平均</span>
              <span class="font-medium text-gray-800">{{ formatValue(data.weeklyAverage) }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-t border-gray-100">
              <span class="text-gray-600">本月平均</span>
              <span class="font-medium text-gray-800">{{ formatValue(data.monthlyAverage) }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-t border-gray-100">
              <span class="text-gray-600">最低数值</span>
              <span class="font-medium text-gray-800">{{ formatValue(data.lowestValue) }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-t border-gray-100">
              <span class="text-gray-600">最高数值</span>
              <span class="font-medium text-gray-800">{{ formatValue(data.highestValue) }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-t border-gray-100">
              <span class="text-gray-600">波动范围</span>
              <span class="font-medium text-gray-800">{{ formatValue(data.volatility) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 变化趋势 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 class="text-lg font-medium text-gray-800 mb-4">变化趋势</h3>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">周变化</span>
                <span :class="getChangeClass(data.weeklyChange)">{{ formatChange(data.weeklyChange) }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="getChangeBarClass(data.weeklyChange)"
                  :style="{ width: getChangePercentage(data.weeklyChange) }">
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">月变化</span>
                <span :class="getChangeClass(data.monthlyChange)">{{ formatChange(data.monthlyChange) }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="getChangeBarClass(data.monthlyChange)"
                  :style="{ width: getChangePercentage(data.monthlyChange) }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧图表和详情 -->
      <div class="md:col-span-8 space-y-4">
        <!-- 趋势预测图表 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-800">趋势预测</h3>
            <div class="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">未来4周</div>
          </div>
          
          <div class="h-64">
            <v-chart class="chart" :option="predictionChartOption" :autoresize="true" />
          </div>
        </div>
        
        <!-- 数据分析详情 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 class="text-lg font-medium text-gray-800 mb-4">分析详情</h3>
          
          <div class="text-gray-700">
            <p class="mb-3">
              根据您最近的{{ title }}数据，我们分析到您的身体状况{{ getTrendDescription() }}。
            </p>
            
            <p class="mb-3">
              <template v-if="chartType === 'weight'">
                您的体重在过去一个月内{{ getChangeDescription('weight', data.monthlyChange) }}。
                目前体重波动范围是 {{ data.volatility }} kg，
                {{ data.volatility < 1.5 ? '这个波动范围较小，体重较稳定' : '波动较大，建议保持更稳定的饮食和运动习惯' }}。
              </template>
              <template v-else>
                您的体脂率在过去一个月内{{ getChangeDescription('bodyFat', data.monthlyChange) }}。
                目前体脂率波动范围是 {{ data.volatility }}%，
                {{ data.volatility < 1 ? '这个波动范围较小，代谢状态稳定' : '波动较大，建议调整饮食结构并增加力量训练' }}。
              </template>
            </p>
            
            <p class="mb-3">
              根据趋势预测，如果保持当前的生活方式，您在接下来4周的{{ title }}可能会
              {{ getPredictionDescription() }}。
            </p>
            
            <div class="bg-indigo-50 p-3 rounded-md mt-4">
              <h4 class="font-medium text-indigo-700 mb-2">个性化建议</h4>
              <ul class="list-disc pl-5 text-indigo-800 space-y-1">
                <template v-if="chartType === 'weight'">
                  <li v-if="data.trend === 'up' && !isWeightGainDesired">控制每日热量摄入，减少精制碳水化合物的摄入</li>
                  <li v-if="data.trend === 'down' && isWeightGainDesired">增加蛋白质摄入，加强力量训练增加肌肉</li>
                  <li>保持每日8000步以上的活动量</li>
                  <li>每周进行3-4次30分钟以上的有氧运动</li>
                  <li>保持良好的睡眠质量，每晚7-8小时睡眠</li>
                  <li>定期记录{{ title }}数据，观察变化趋势</li>
                </template>
                <template v-else>
                  <li v-if="data.trend === 'up'">增加蛋白质摄入，减少高糖食物</li>
                  <li v-if="data.trend === 'stable' || data.trend === 'down'">保持当前的饮食结构，增加运动频率</li>
                  <li>每周进行2-3次力量训练，增加肌肉量</li>
                  <li>进行高强度间歇训练（HIIT），提高代谢率</li>
                  <li>保持充足的水分摄入</li>
                  <li>避免长时间久坐，每小时起身活动5分钟</li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// 注册必要的ECharts组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

const props = defineProps({
  chartType: {
    type: String,
    required: true,
    validator: (value) => ['weight', 'bodyFat'].includes(value)
  },
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// 标题
const title = computed(() => props.chartType === 'weight' ? '体重' : '体脂率');

// 是否期望体重增加（在真实应用中，应该从用户设置中获取）
const isWeightGainDesired = ref(false);

// 获取趋势文本
function getTrendText(trend) {
  if (trend === 'up') return '上升';
  if (trend === 'down') return '下降';
  return '稳定';
}

// 获取趋势类名
function getTrendClass(trend) {
  if (trend === 'up') {
    // 体重上升通常为红色（不好），但如果用户想增重，则为绿色
    if (props.chartType === 'weight') {
      return isWeightGainDesired.value ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
    }
    // 体脂上升通常为红色（不好）
    return 'text-red-600 font-medium';
  }
  
  if (trend === 'down') {
    // 体重下降通常为绿色（好），但如果用户想增重，则为红色
    if (props.chartType === 'weight') {
      return isWeightGainDesired.value ? 'text-red-600 font-medium' : 'text-green-600 font-medium';
    }
    // 体脂下降通常为绿色（好）
    return 'text-green-600 font-medium';
  }
  
  return 'text-blue-600 font-medium';
}

// 格式化值
function formatValue(value) {
  if (props.chartType === 'weight') {
    return `${value} kg`;
  } else {
    return `${value}%`;
  }
}

// 格式化变化值
function formatChange(change) {
  const prefix = change > 0 ? '+' : '';
  if (props.chartType === 'weight') {
    return `${prefix}${change} kg`;
  } else {
    return `${prefix}${change}%`;
  }
}

// 获取变化值类名
function getChangeClass(change) {
  if (change === 0) return 'text-blue-600 font-medium';
  
  if (props.chartType === 'weight') {
    const isIncrease = change > 0;
    // 对于体重，增加通常为红色（不好），除非想增重
    if (isIncrease) {
      return isWeightGainDesired.value ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
    } else {
      return isWeightGainDesired.value ? 'text-red-600 font-medium' : 'text-green-600 font-medium';
    }
  } else {
    // 对于体脂率，增加通常为红色（不好）
    return change > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium';
  }
}

// 获取变化条类名
function getChangeBarClass(change) {
  if (change === 0) return 'bg-blue-500';
  
  if (props.chartType === 'weight') {
    const isIncrease = change > 0;
    // 对于体重，增加通常为红色，除非想增重
    if (isIncrease) {
      return isWeightGainDesired.value ? 'bg-green-500' : 'bg-red-500';
    } else {
      return isWeightGainDesired.value ? 'bg-red-500' : 'bg-green-500';
    }
  } else {
    // 对于体脂率，增加通常为红色
    return change > 0 ? 'bg-red-500' : 'bg-green-500';
  }
}

// 获取变化百分比（用于显示变化条的宽度）
function getChangePercentage(change) {
  const absChange = Math.abs(change);
  let maxChange;
  
  if (props.chartType === 'weight') {
    maxChange = 5; // 5kg作为最大可能变化
  } else {
    maxChange = 3; // 3%作为最大可能变化
  }
  
  const percentage = Math.min(absChange / maxChange * 100, 100);
  return `${percentage}%`;
}

// 获取趋势描述
function getTrendDescription() {
  const type = props.chartType;
  const trend = props.data.trend;
  
  if (type === 'weight') {
    if (trend === 'up') {
      return isWeightGainDesired.value 
        ? '正朝着增重的目标稳步前进' 
        : '有轻微上升的趋势，建议关注饮食和运动';
    } else if (trend === 'down') {
      return isWeightGainDesired.value 
        ? '存在一定的减重趋势，需要增加热量摄入' 
        : '正在良好地减轻体重';
    } else {
      return '保持稳定，没有明显波动';
    }
  } else {
    if (trend === 'up') {
      return '体脂率有上升趋势，建议增加运动量';
    } else if (trend === 'down') {
      return '体脂率正在良好地下降，代谢状态改善';
    } else {
      return '体脂率保持稳定';
    }
  }
}

// 获取变化描述
function getChangeDescription(type, change) {
  if (type === 'weight') {
    if (change > 0) {
      return `增加了 ${Math.abs(change)} kg`;
    } else if (change < 0) {
      return `减少了 ${Math.abs(change)} kg`;
    } else {
      return '保持稳定';
    }
  } else {
    if (change > 0) {
      return `增加了 ${Math.abs(change)}%`;
    } else if (change < 0) {
      return `减少了 ${Math.abs(change)}%`;
    } else {
      return '保持稳定';
    }
  }
}

// 获取预测描述
function getPredictionDescription() {
  const predictions = props.data.predictions;
  const firstValue = predictions[0];
  const lastValue = predictions[predictions.length - 1];
  const diff = lastValue - firstValue;
  
  if (Math.abs(diff) < 0.1) {
    return '保持稳定';
  }
  
  if (props.chartType === 'weight') {
    if (diff > 0) {
      return `继续增加，预计增加约 ${diff.toFixed(1)} kg`;
    } else {
      return `继续下降，预计减少约 ${Math.abs(diff).toFixed(1)} kg`;
    }
  } else {
    if (diff > 0) {
      return `继续增加，预计增加约 ${diff.toFixed(1)}%`;
    } else {
      return `继续下降，预计减少约 ${Math.abs(diff).toFixed(1)}%`;
    }
  }
}

// 预测图表选项
const predictionChartOption = computed(() => {
  if (!props.data) return {};
  
  const type = props.chartType;
  const currentValue = type === 'weight' ? props.data.weeklyAverage : props.data.weeklyAverage;
  const predictions = props.data.predictions;
  
  // 历史数据（这里我们没有真实数据，所以生成模拟数据）
  const historyData = [
    currentValue - (Math.random() * 0.5 + 0.2),
    currentValue - (Math.random() * 0.3 + 0.1),
    currentValue
  ];
  
  // 合并历史和预测
  const allData = [...historyData, ...predictions];
  
  // X轴标签
  const weekLabels = [];
  for (let i = -3; i < predictions.length; i++) {
    if (i < 0) {
      weekLabels.push(`前${Math.abs(i)}周`);
    } else if (i === 0) {
      weekLabels.push('本周');
    } else {
      weekLabels.push(`后${i}周`);
    }
  }
  
  // 决定线条颜色
  let lineColor;
  if (type === 'weight') {
    lineColor = predictions[predictions.length - 1] > currentValue 
      ? (isWeightGainDesired.value ? '#10b981' : '#ef4444') 
      : (isWeightGainDesired.value ? '#ef4444' : '#10b981');
  } else {
    lineColor = predictions[predictions.length - 1] > currentValue ? '#ef4444' : '#10b981';
  }
  
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const param = params[0];
        const value = param.value;
        const unit = type === 'weight' ? 'kg' : '%';
        return `${param.name}: ${value}${unit}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: weekLabels,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      min: function(value) {
        return value.min - 0.5;
      },
      max: function(value) {
        return value.max + 0.5;
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 12,
        formatter: function(value) {
          return type === 'weight' ? `${value}kg` : `${value}%`;
        }
      },
      splitLine: {
        lineStyle: {
          color: '#eee',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: type === 'weight' ? '体重' : '体脂率',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: lineColor
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#fff',
          borderWidth: 2,
          borderColor: lineColor
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: lineColor + '20' // 20%透明度
              },
              {
                offset: 1,
                color: lineColor + '01' // 1%透明度
              }
            ]
          }
        },
        data: allData,
        markLine: {
          symbol: 'none',
          lineStyle: {
            color: '#aaa',
            type: 'dashed'
          },
          data: [
            {
              name: '当前',
              xAxis: 2 // 第3个点是当前周
            }
          ],
          label: {
            formatter: '当前',
            position: 'start'
          }
        },
        markArea: {
          itemStyle: {
            color: 'rgba(200, 200, 200, 0.1)'
          },
          data: [
            [{
              name: '预测区间',
              xAxis: 2
            }, {
              xAxis: 'max'
            }]
          ],
          label: {
            show: false
          }
        }
      }
    ],
    animation: true
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style> 