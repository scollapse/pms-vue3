import { ref, computed } from 'vue';
import { format, addDays, subDays, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, parseISO } from 'date-fns';

export function useHealthData() {
  // 当前日期
  const currentDate = ref(new Date());
  
  // 当前记录
  const currentRecord = ref(null);
  
  // 健康记录列表
  const healthRecords = ref([]);
  
  // 身高
  const height = ref(178);
  
  // 目标体重
  const targetWeight = ref(70);
  
  // 起始体重
  const startWeight = ref(80);
  
  // 起始日期
  const startDate = ref(new Date(2023, 4, 1)); // 2023年5月1日
  
  // 预计达成日期
  const projectedDate = ref(new Date(2023, 7, 1)); // 2023年8月1日
  
  // 图表类型
  const chartType = ref('weight');
  
  // 体重趋势
  const weightTrend = ref('down');
  
  // 体脂趋势
  const bodyFatTrend = ref('down');
  
  // 运动记录
  const exerciseRecords = ref([]);
  
  // 生成健康记录
  function generateHealthRecords() {
    const records = [];
    
    // 生成过去30天的记录
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // 起始值
    let weight = 78.5;
    let bodyFat = 20.5;
    let muscleMass = 35.2;
    let waterRate = 52.4;
    let boneMass = 3.4;
    
    days.forEach((day, index) => {
      // 70%的几率生成记录
      if (Math.random() < 0.7) {
        // 添加一些随机波动
        const weightChange = (Math.random() - 0.65) * 0.4; // 偏向减小
        const bodyFatChange = (Math.random() - 0.6) * 0.2; // 偏向减小
        const muscleMassChange = (Math.random() - 0.4) * 0.2; // 偏向增加
        const waterRateChange = (Math.random() - 0.5) * 0.3;
        const boneMassChange = (Math.random() - 0.5) * 0.1;
        
        weight += weightChange;
        bodyFat += bodyFatChange;
        muscleMass += muscleMassChange;
        waterRate += waterRateChange;
        boneMass += boneMassChange;
        
        // 确保值在合理范围内
        weight = Math.max(65, Math.min(85, weight));
        bodyFat = Math.max(15, Math.min(25, bodyFat));
        muscleMass = Math.max(32, Math.min(38, muscleMass));
        waterRate = Math.max(50, Math.min(55, waterRate));
        boneMass = Math.max(3.2, Math.min(3.6, boneMass));
        
        records.push({
          id: index + 1,
          date: format(day, 'yyyy-MM-dd'),
          weight: parseFloat(weight.toFixed(1)),
          bodyFat: parseFloat(bodyFat.toFixed(1)),
          muscleMass: parseFloat(muscleMass.toFixed(1)),
          waterRate: parseFloat(waterRate.toFixed(1)),
          boneMass: parseFloat(boneMass.toFixed(1)),
          notes: index % 7 === 0 ? '周记录，感觉良好，饮食控制不错' : ''
        });
      }
    });
    
    return records;
  }
  
  // 生成运动记录
  function generateExerciseRecords() {
    const records = [];
    
    // 生成过去14天的记录
    const endDate = new Date();
    const startDate = subDays(endDate, 14);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const exerciseTypes = ['run', 'walk', 'cycle', 'swim', 'weightlifting', 'yoga', 'basketball'];
    
    days.forEach((day, index) => {
      // 60%的几率生成记录，周末概率更高
      const dayOfWeek = day.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const probability = isWeekend ? 0.8 : 0.6;
      
      if (Math.random() < probability) {
        // 随机选择运动类型
        const type = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
        
        // 根据类型生成合理的时长和卡路里
        let duration, calories, intensity;
        
        if (type === 'walk') {
          duration = Math.floor(Math.random() * 40) + 20; // 20-60分钟
          intensity = 1; // 低强度
          calories = Math.floor(duration * 4 + Math.random() * 30);
        } else if (['run', 'cycle'].includes(type)) {
          duration = Math.floor(Math.random() * 30) + 20; // 20-50分钟
          intensity = Math.random() < 0.7 ? 2 : 3; // 中高强度
          calories = Math.floor(duration * (intensity === 3 ? 10 : 8) + Math.random() * 50);
        } else if (type === 'swim') {
          duration = Math.floor(Math.random() * 20) + 20; // 20-40分钟
          intensity = 2; // 中强度
          calories = Math.floor(duration * 9 + Math.random() * 40);
        } else if (type === 'weightlifting') {
          duration = Math.floor(Math.random() * 30) + 30; // 30-60分钟
          intensity = 2; // 中强度
          calories = Math.floor(duration * 7 + Math.random() * 40);
        } else if (type === 'yoga') {
          duration = Math.floor(Math.random() * 15) + 45; // 45-60分钟
          intensity = 1; // 低强度
          calories = Math.floor(duration * 4 + Math.random() * 20);
        } else if (type === 'basketball') {
          duration = Math.floor(Math.random() * 30) + 30; // 30-60分钟
          intensity = 3; // 高强度
          calories = Math.floor(duration * 10 + Math.random() * 60);
        }
        
        records.push({
          id: index + 1,
          date: format(day, 'yyyy-MM-dd'),
          type,
          duration,
          intensity,
          calories,
          description: index % 5 === 0 ? `${format(day, 'MM月dd日')}的${type}训练，感觉良好` : ''
        });
      }
    });
    
    return records;
  }
  
  // 初始化数据
  healthRecords.value = generateHealthRecords();
  exerciseRecords.value = generateExerciseRecords();
  
  // 更新当前记录
  function updateCurrentRecord() {
    // 根据当前日期获取记录
    const found = healthRecords.value.find(record => {
      return isSameDay(parseISO(record.date), currentDate.value);
    });
    
    if (found) {
      currentRecord.value = { ...found };
    } else {
      // 如果当天没有记录，则使用最近的记录
      const sortedRecords = [...healthRecords.value].sort((a, b) => {
        return Math.abs(parseISO(a.date) - currentDate.value) - Math.abs(parseISO(b.date) - currentDate.value);
      });
      
      if (sortedRecords.length > 0) {
        currentRecord.value = { ...sortedRecords[0] };
      } else {
        currentRecord.value = null;
      }
    }
  }
  
  // 设置当前日期
  function setCurrentDate(date) {
    currentDate.value = date;
    updateCurrentRecord();
  }
  
  // 图表数据
  const chartDates = computed(() => {
    // 获取最近两周的日期
    const endDate = new Date();
    const startDate = subDays(endDate, 13); // 14天
    
    return eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
      return format(date, 'MM-dd');
    });
  });
  
  // 为图表生成体重点
  const weightChartPoints = computed(() => {
    // 获取最近两周的体重数据
    const endDate = new Date();
    const startDate = subDays(endDate, 13); // 14天
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRange.map(date => {
      const record = healthRecords.value.find(r => {
        return isSameDay(parseISO(r.date), date);
      });
      
      return record ? record.weight : null;
    });
  });
  
  // 为图表生成体脂点
  const bodyFatChartPoints = computed(() => {
    // 获取最近两周的体脂数据
    const endDate = new Date();
    const startDate = subDays(endDate, 13); // 14天
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRange.map(date => {
      const record = healthRecords.value.find(r => {
        return isSameDay(parseISO(r.date), date);
      });
      
      return record ? record.bodyFat : null;
    });
  });
  
  // 生成图表路径
  const weightChartPath = computed(() => {
    // 体重图表路径
    return generateChartPath(weightChartPoints.value);
  });
  
  const bodyFatChartPath = computed(() => {
    // 体脂图表路径
    return generateChartPath(bodyFatChartPoints.value);
  });
  
  // 生成图表路径辅助函数
  function generateChartPath(dataPoints) {
    if (!dataPoints || dataPoints.length === 0) return '';
    
    // 找到有效点
    const validPoints = dataPoints.map((point, index) => {
      return point !== null ? { index, value: point } : null;
    }).filter(p => p !== null);
    
    if (validPoints.length === 0) return '';
    
    // 计算 y 值的范围
    const values = validPoints.map(p => p.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;
    
    // 图表尺寸
    const chartWidth = 100;
    const chartHeight = 100;
    const padding = 10;
    
    // 计算位置
    const points = validPoints.map(point => {
      const x = (point.index / (dataPoints.length - 1)) * (chartWidth - 2 * padding) + padding;
      const y = valueRange === 0 
        ? chartHeight - padding 
        : chartHeight - padding - ((point.value - minValue) / valueRange) * (chartHeight - 2 * padding);
      
      return { x, y };
    });
    
    // 生成 SVG 路径
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`;
    }
    
    return path;
  }
  
  // 进度百分比
  const progressPercentage = computed(() => {
    if (!currentRecord.value) return 0;
    
    const current = currentRecord.value.weight;
    const target = targetWeight.value;
    const start = startWeight.value;
    
    if (start === target) return 100;
    
    const progress = (start - current) / (start - target) * 100;
    return Math.max(0, Math.min(100, progress));
  });
  
  // 周运动统计
  const weeklyExerciseStats = computed(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // 从周一开始
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    // 获取本周的运动记录
    const weeklyRecords = exerciseRecords.value.filter(record => {
      const recordDate = parseISO(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
    
    // 计算总时长和总消耗卡路里
    const totalDuration = weeklyRecords.reduce((sum, record) => sum + record.duration, 0);
    const totalCalories = weeklyRecords.reduce((sum, record) => sum + record.calories, 0);
    
    // 计算不同类型的运动次数
    const typeCount = weeklyRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {});
    
    // 计算本周运动天数
    const uniqueDates = new Set(weeklyRecords.map(record => record.date));
    const exerciseDays = uniqueDates.size;
    
    return {
      totalDuration,
      totalCalories,
      exerciseDays,
      exerciseCount: weeklyRecords.length,
      types: Object.entries(typeCount).map(([type, count]) => ({ type, count }))
    };
  });
  
  // 周运动数据
  const weeklyExerciseData = computed(() => {
    // 获取过去7天的数据
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
    
    // 处理每天的运动数据
    return days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayLabel = format(day, 'MM-dd');
      
      // 查找当天的运动记录
      const dayRecords = exerciseRecords.value.filter(record => record.date === dayString);
      
      // 如果没有记录
      if (dayRecords.length === 0) {
        return {
          date: dayLabel,
          duration: 0,
          calories: 0,
          exercises: []
        };
      }
      
      // 计算总时长和总卡路里
      const duration = dayRecords.reduce((sum, record) => sum + record.duration, 0);
      const calories = dayRecords.reduce((sum, record) => sum + record.calories, 0);
      
      return {
        date: dayLabel,
        duration,
        calories,
        exercises: dayRecords
      };
    });
  });
  
  // 最近的运动记录
  const recentExercises = computed(() => {
    return [...exerciseRecords.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  });
  
  // 保存健康记录
  async function saveHealthRecord(data) {
    // 模拟保存记录
    // 在实际应用中，这里会调用API保存记录
    
    const recordDate = typeof data.date === 'string' ? parseISO(data.date) : data.date;
    
    // 检查是否存在该日期的记录
    const existingIndex = healthRecords.value.findIndex(record => {
      return isSameDay(parseISO(record.date), recordDate);
    });
    
    if (existingIndex >= 0) {
      // 更新现有记录
      healthRecords.value[existingIndex] = {
        ...healthRecords.value[existingIndex],
        ...data,
        date: format(recordDate, 'yyyy-MM-dd')
      };
    } else {
      // 添加新记录
      const newRecord = {
        id: Date.now(),
        ...data,
        date: format(recordDate, 'yyyy-MM-dd')
      };
      
      healthRecords.value.push(newRecord);
      
      // 按日期排序
      healthRecords.value.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }
    
    // 更新当前记录
    updateCurrentRecord();
    
    return Promise.resolve();
  }
  
  // 删除记录
  async function deleteRecord(id) {
    // 模拟删除记录
    // 在实际应用中，这里会调用API删除记录
    
    const index = healthRecords.value.findIndex(record => record.id === id);
    
    if (index >= 0) {
      healthRecords.value.splice(index, 1);
      
      // 更新当前记录
      updateCurrentRecord();
    }
    
    return Promise.resolve();
  }
  
  // 加载健康数据
  async function loadHealthData() {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新当前记录
    updateCurrentRecord();
    
    return Promise.resolve();
  }
  
  // 初始化
  updateCurrentRecord();
  
  return {
    currentDate,
    setCurrentDate,
    currentRecord,
    healthRecords,
    chartType,
    chartDates,
    weightChartPoints,
    bodyFatChartPoints,
    weightChartPath,
    bodyFatChartPath,
    weightTrend,
    bodyFatTrend,
    height,
    targetWeight,
    startWeight,
    startDate,
    projectedDate,
    progressPercentage,
    saveHealthRecord,
    deleteRecord,
    loadHealthData,
    weeklyExerciseStats,
    weeklyExerciseData,
    recentExercises,
    exerciseRecords
  };
} 