<template>
  <div :class="{ 'mh-container': true, 'dark-mode': darkMode }">
    <div class="mh-header">
      <button @click="prevMonth" class="mh-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h3 class="mh-title">{{ formattedMonth }}</h3>
      <button @click="nextMonth" class="mh-nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
    
    <div class="mh-calendar">
      <!-- 星期标题 -->
      <div class="mh-weekdays">
        <div v-for="day in locale.days" :key="day" class="mh-weekday">{{ day }}</div>
      </div>
      
      <!-- 日历网格 -->
      <div class="mh-grid">
        <!-- 填充前置空白日期 -->
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="mh-day mh-empty"></div>
        
        <!-- 月份日期 -->
        <div 
          v-for="day in daysInMonth" 
          :key="day" 
          class="mh-day"
          :class="[getDayClass(day)]"
          @click="handleDayClick(day)"
          :style="{ backgroundColor: getColorForCount(getDayData(day)?.count || 0) }"
          ref="dayElements"
        >
          <span class="mh-day-number">{{ day }}</span>
        </div>
      </div>
    </div>
    
    <div class="mh-legend">
      <div>{{ locale.less }}</div>
      <div class="mh-legend-colors">
        <div 
          v-for="(color, index) in rangeColors" 
          :key="index" 
          class="mh-legend-color" 
          :style="{ backgroundColor: color }"
        ></div>
      </div>
      <div>{{ locale.more }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, toRef, onMounted } from 'vue';
import dayjs from 'dayjs';
import tippy, { createSingleton } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';


export default defineComponent({
  name: 'MonthHeatmap',
  props: {
    month: {
      type: Date,
      default: () => new Date()
    },
    values: {
      type: Array,
      required: true
    },
    max: Number,
    rangeColors: {
      type: Array,
      default: () => ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
    },
    locale: {
      type: Object,
      default: () => ({
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        less: 'less',
        more: 'more'
      })
    },
    tooltipUnit: {
      type: String,
      default: '个任务'
    },
    darkMode: Boolean,
    round: {
      type: Number,
      default: 0
    }
  },
  emits: ['dayClick', 'monthChange'],
  setup(props, { emit }) {
    const currentMonth = ref(new Date(props.month));
    const selectedDay = ref(null);
    const dayElements = ref([]);
    
    // 计算当前月份的格式化显示
    const formattedMonth = computed(() => {
      const month = currentMonth.value.getMonth();
      const year = currentMonth.value.getFullYear();
      return `${props.locale.months[month]} ${year}`;
    });
    
    // 计算当月天数
    const daysInMonth = computed(() => {
      return new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + 1,
        0
      ).getDate();
    });
    
    // 计算当月第一天是星期几（0是星期日，1是星期一，...）
    const firstDayOfMonth = computed(() => {
      const firstDay = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth(),
        1
      ).getDay();
      // 调整为周一为一周的第一天
      return firstDay === 0 ? 6 : firstDay - 1;
    });
    
    // 获取某一天的数据
    const getDayData = (day) => {
      const date = dayjs(new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth(),
        day
      )).format('YYYY-MM-DD');
      
      return props.values.find(v => v.date === date);
    };
    
    // 获取某一天的CSS类
    const getDayClass = (day) => {
      const today = new Date();
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === currentMonth.value.getMonth() && 
        today.getFullYear() === currentMonth.value.getFullYear();
      
      const dayData = getDayData(day);
      const hasData = dayData && dayData.count > 0;
      
      return {
        'mh-today': isToday,
        'mh-has-data': hasData
      };
    };
    
    // 根据数量获取颜色
    const getColorForCount = (count) => {
      if (!count) return props.rangeColors[0];
      
      const max = props.max || Math.max(...props.values.map(v => v.count || 0));
      if (max === 0) return props.rangeColors[0];
      
      const index = Math.min(
        Math.floor((count / max) * (props.rangeColors.length - 1)),
        props.rangeColors.length - 1
      );
      
      return props.rangeColors[index];
    };
    
    // 切换到上个月
    const prevMonth = () => {
      currentMonth.value = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() - 1,
        1
      );
      emit('monthChange', currentMonth.value);
    };
    
    // 切换到下个月
    const nextMonth = () => {
      currentMonth.value = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth() + 1,
        1
      );
      emit('monthChange', currentMonth.value);
    };
    
    // 处理日期点击
    const handleDayClick = (day) => {
      selectedDay.value = day;
      const date = new Date(
        currentMonth.value.getFullYear(),
        currentMonth.value.getMonth(),
        day
      );
      const dayData = getDayData(day) || { date: dayjs(date).format('YYYY-MM-DD'), count: 0 };
      emit('dayClick', dayData);
    };
    
    // 初始化工具提示
    const initTooltips = () => {
      if (dayElements.value && dayElements.value.length > 0) {
        // 销毁之前的提示
        const instances = [];
        
        dayElements.value.forEach((el, index) => {
          if (el) {
            const day = index + 1;
            const date = dayjs(new Date(
              currentMonth.value.getFullYear(),
              currentMonth.value.getMonth(),
              day
            )).format('YYYY-MM-DD');
            const dayData = props.values.find(v => v.date === date);
            const count = dayData?.count || 0;
            
            instances.push(
              tippy(el, {
                content: `${day}日: ${count} ${props.tooltipUnit}`,
                arrow: true,
                placement: 'top',
                theme: props.darkMode ? 'dark' : 'light'
              })
            );
          }
        });
      }
    };
    
    // 监听props.month变化
    watch(() => props.month, (newMonth) => {
      currentMonth.value = new Date(newMonth);
      selectedDay.value = null;
      // 月份变化后需要重新初始化提示
      setTimeout(initTooltips, 100);
    });
    
    // 组件挂载后初始化提示
    onMounted(() => {
      setTimeout(initTooltips, 100);
    });
    
    // 监听日期元素变化
    watch(dayElements, () => {
      setTimeout(initTooltips, 100);
    });
    
    return {
      currentMonth,
      formattedMonth,
      daysInMonth,
      firstDayOfMonth,
      getDayData,
      getDayClass,
      getColorForCount,
      prevMonth,
      nextMonth,
      handleDayClick,
      dayElements,
      locale: toRef(props, 'locale'),
      tooltipUnit: toRef(props, 'tooltipUnit')
    };
  }
});
</script>

<style lang="scss" scoped>
.mh-container {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  
  &.dark-mode {
    color: #fff;
    
    .mh-header, .mh-weekdays, .mh-day {
      color: #eee;
    }
    
    .mh-nav-btn {
      color: #ddd;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    
    .mh-day {
      background-color: rgba(255, 255, 255, 0.05);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.mh-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.mh-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0 16px;
}

.mh-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    outline: none;
  }
}

.mh-calendar {
  width: 100%;
}

.mh-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 8px;
}

.mh-weekday {
  padding: 8px 0;
}

.mh-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.mh-day {
  aspect-ratio: 3/1; /* 横向矩形，宽是高的3倍 */
  border-radius: v-bind('round + "px"');
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  height: 24px;
  margin: 0 auto;
  width: 100%;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.mh-empty {
    background-color: transparent;
    cursor: default;
  }
  
  &:hover {
    stroke: #555;
    stroke-width: 2px;
    paint-order: stroke;
  }
  
  &.mh-today {
    box-shadow: inset 0 0 0 1px #f8e875;
  }
  
}

.mh-day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.mh-day-number {
  font-size: 12px;
  font-weight: 500;
}

.mh-day-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 2px;
}

.mh-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  font-size: 12px;
}

.mh-legend-colors {
  display: flex;
  margin: 0 8px;
}

.mh-legend-color {
  width: 12px;
  height: 12px;
  margin: 0 2px;
  border-radius: v-bind('round + "px"');
}
</style>