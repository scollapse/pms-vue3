<template>
  <div class="datepicker-wrapper relative">
    <div class="relative">
      <input
        ref="input"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        class="w-full py-2.5 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
        :class="{ 
          'border-gray-300 hover:border-blue-300': !disabled, 
          'bg-gray-100 border-gray-200 text-gray-500': disabled,
          'border-blue-400': isCalendarOpen
        }"
        :disabled="disabled"
        readonly
        @click="openCalendar"
      />
      
      <!-- 日期图标 -->
      <div 
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        :class="{ 'text-gray-400': disabled, 'text-gray-500 hover:text-blue-500': !disabled }"
        @click="toggleCalendar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" :class="{'rotate-180': isCalendarOpen}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <!-- 清除按钮 - 当有值时显示 -->
      <div 
        v-if="props.modelValue && !disabled && props.clearable" 
        class="absolute inset-y-0 right-9 flex items-center cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
        @click="clearAndClose"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- 自定义日历弹出框 -->
    <div 
      v-if="isCalendarOpen" 
      class="calendar-dropdown absolute mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 calendar-animation"
      @click.stop
    >
      <div class="calendar-header bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-t-lg border-b border-gray-100">
        <!-- 月份和年份选择器 -->
        <div class="flex justify-between items-center">
          <button 
            @click="prevMonth" 
            class="p-1 rounded-full hover:bg-white/50 text-gray-700 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div class="flex items-center">
            <select 
              v-model="currentMonth" 
              class="bg-transparent text-gray-800 font-medium text-sm py-1 px-2 mr-1 rounded border-none focus:ring-1 focus:ring-blue-300"
            >
              <option v-for="(month, idx) in monthNames" :key="idx" :value="idx">{{ month }}</option>
            </select>
            
            <select 
              v-model="currentYear" 
              class="bg-transparent text-gray-800 font-medium text-sm py-1 px-2 rounded border-none focus:ring-1 focus:ring-blue-300"
            >
              <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          
          <button 
            @click="nextMonth" 
            class="p-1 rounded-full hover:bg-white/50 text-gray-700 transition-colors focus:outline-none"
            :disabled="isNextMonthDisabled"
            :class="{'opacity-50 cursor-not-allowed': isNextMonthDisabled}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="calendar-body p-3">
        <!-- 星期标题行 -->
        <div class="grid grid-cols-7 mb-2">
          <div v-for="day in weekdayLabels" :key="day" class="text-center text-xs font-medium text-gray-500 py-1">
            {{ day }}
          </div>
        </div>
        
        <!-- 日期网格 -->
        <div class="grid grid-cols-7 gap-1">
          <!-- 填充前置空白 -->
          <div 
            v-for="n in firstDayOfMonth" 
            :key="`empty-${n}`" 
            class="w-9 h-9"
          ></div>
          
          <!-- 日期单元格 -->
          <button
            v-for="day in daysInMonth"
            :key="day"
            @click="selectDate(day)"
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 hover:bg-blue-100 focus:outline-none relative"
            :class="getDayClass(day)"
            :disabled="isDayDisabled(day)"
          >
            {{ day }}
            <span 
              v-if="isToday(day)" 
              class="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500"
            ></span>
          </button>
        </div>
      </div>
      
      <div class="calendar-footer bg-gray-50 p-3 rounded-b-lg border-t border-gray-100 flex items-center justify-between">
        <button 
          @click="setToday" 
          class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          今天
        </button>
        
        <button 
          @click="clearDate" 
          class="text-sm text-gray-600 hover:text-gray-800 flex items-center hover:bg-gray-100 px-3 py-1.5 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          清除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择日期'
  },
  minDate: {
    type: String,
    default: null
  },
  maxDate: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'clear']);

const input = ref(null);
const isCalendarOpen = ref(false);

// 日期相关数据
const currentDate = ref(new Date());
const currentYear = ref(currentDate.value.getFullYear());
const currentMonth = ref(currentDate.value.getMonth());

// 月份名称
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
// 星期标题
const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];

// 计算年份范围（当前年份前后10年）
const yearRange = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
});

// 计算当月第一天是星期几（0-6）
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// 计算当月天数
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

// 检查是否禁用下个月按钮（如果有maxDate且下个月超出范围）
const isNextMonthDisabled = computed(() => {
  if (!props.maxDate) return false;
  const maxDate = new Date(props.maxDate);
  const nextMonth = new Date(currentYear.value, currentMonth.value + 1, 1);
  return nextMonth > maxDate;
});

// 格式化显示值
const displayValue = computed(() => {
  if (!props.modelValue) return '';
  return formatDate(props.modelValue);
});

// 前一个月
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// 下一个月
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 切换日历显示
const toggleCalendar = (e) => {
  e.stopPropagation();
  if (props.disabled) return;
  isCalendarOpen.value = !isCalendarOpen.value;
  
  if (isCalendarOpen.value && props.modelValue) {
    // 如果日历打开且已有选中日期，将日历设置到选中日期所在月份
    const selectedDate = new Date(props.modelValue);
    currentYear.value = selectedDate.getFullYear();
    currentMonth.value = selectedDate.getMonth();
  }
};

// 打开日历
const openCalendar = () => {
  if (props.disabled) return;
  isCalendarOpen.value = true;
  
  if (props.modelValue) {
    // 如果有选中日期，将日历设置到选中日期所在月份
    const selectedDate = new Date(props.modelValue);
    currentYear.value = selectedDate.getFullYear();
    currentMonth.value = selectedDate.getMonth();
  }
};

// 关闭日历
const closeCalendar = () => {
  isCalendarOpen.value = false;
};

// 清除日期并关闭日历
const clearAndClose = (e) => {
  e.stopPropagation();
  if (props.clearable) {
    emit('update:modelValue', '');
    emit('clear');
    closeCalendar();
  }
};

// 检查日期是否为今天
const isToday = (day) => {
  const today = new Date();
  return today.getDate() === day && 
         today.getMonth() === currentMonth.value && 
         today.getFullYear() === currentYear.value;
};

// 检查日期是否被选中
const isSelected = (day) => {
  if (!props.modelValue) return false;
  const selected = new Date(props.modelValue);
  return selected.getDate() === day && 
         selected.getMonth() === currentMonth.value && 
         selected.getFullYear() === currentYear.value;
};

// 检查日期是否禁用
const isDayDisabled = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  
  if (props.minDate) {
    const minDate = new Date(props.minDate);
    minDate.setHours(0, 0, 0, 0);
    if (date < minDate) return true;
  }
  
  if (props.maxDate) {
    const maxDate = new Date(props.maxDate);
    maxDate.setHours(23, 59, 59, 999);
    if (date > maxDate) return true;
  }
  
  return false;
};

// 获取日期样式类
const getDayClass = (day) => {
  if (isSelected(day)) {
    return 'bg-blue-500 text-white hover:bg-blue-600 font-medium';
  } else if (isToday(day)) {
    return 'text-blue-600 font-medium hover:bg-blue-100';
  } else if (isDayDisabled(day)) {
    return 'text-gray-300 cursor-not-allowed hover:bg-transparent';
  } else {
    return 'text-gray-700';
  }
};

// 选择日期
const selectDate = (day) => {
  if (isDayDisabled(day)) return;
  
  const date = new Date(currentYear.value, currentMonth.value, day);
  emit('update:modelValue', formatDate(date));
  closeCalendar();
};

// 设置今天日期
const setToday = () => {
  const today = new Date();
  emit('update:modelValue', formatDate(today));
  closeCalendar();
};

// 清除日期
const clearDate = () => {
  if (props.clearable) {
    emit('update:modelValue', '');
    emit('clear');
    closeCalendar();
  }
};

// 格式化日期 YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date;
  }
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 监听点击事件关闭日历
const handleDocumentClick = (e) => {
  const datepickerElement = document.querySelector('.datepicker-wrapper');
  if (datepickerElement && !datepickerElement.contains(e.target)) {
    closeCalendar();
  }
};

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    try {
      const date = new Date(newValue);
      if (!isNaN(date.getTime())) {
        currentYear.value = date.getFullYear();
        currentMonth.value = date.getMonth();
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
  }
});

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  
  // 如果有默认值，设置当前显示的年月
  if (props.modelValue) {
    try {
      const date = new Date(props.modelValue);
      if (!isNaN(date.getTime())) {
        currentYear.value = date.getFullYear();
        currentMonth.value = date.getMonth();
      }
    } catch (error) {
      console.error('Error parsing initial date:', error);
    }
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});

defineExpose({
  setToday,
  clearDate,
  openCalendar,
  closeCalendar
});
</script>

<style scoped>
.calendar-dropdown {
  width: 300px;
}

.calendar-animation {
  animation: fadeInDown 0.25s ease-out;
  transform-origin: top center;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 当日日期小点的动画 */
button:hover span {
  background-color: white;
  transition: background-color 0.2s;
}

/* 日期悬浮效果 */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 日期选中时的脉冲动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 选中的日期有脉冲效果 */
button.bg-blue-500 {
  animation: pulse 2s infinite;
}

/* 自定义下拉选择器样式 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.25rem center;
  background-size: 1rem;
  padding-right: 1.5rem;
}

/* 焦点样式 */
select:focus {
  outline: none;
}
</style>