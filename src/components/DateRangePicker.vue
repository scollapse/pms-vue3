<template>
  <div class="relative">
    <input
      type="text"
      ref="dateInput"
      class="form-input"
      :placeholder="placeholder"
    />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Mandarin } from "flatpickr/dist/l10n/zh.js";

export default {
  name: 'DateRangePicker',
  props: {
    startDate: { type: [String, Date], default: "" },
    endDate: { type: [String, Date], default: "" },
    placeholder: { type: String, default: "选择日期范围" },
    minDate: { type: [String, Date], default: null },
    maxDate: { type: [String, Date], default: null },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      flatpickrInstance: null
    };
  },
  mounted() {
    this.initializeFlatpickr();
  },
  methods: {
    initializeFlatpickr() {
      const self = this;
      this.flatpickrInstance = flatpickr(this.$refs.dateInput, {
        locale: Mandarin,
        mode: "range",
        dateFormat: "Y-m-d H:i:s",
        enableTime: true,
        time_24hr: true,
        defaultDate: [this.startDate, this.endDate].filter(Boolean),
        minDate: this.minDate,
        maxDate: this.maxDate,
        disable: this.disabled ? [() => true] : [],
        disableMobile: true,
        allowInput: true,
        onChange: (selectedDates) => {
          if (selectedDates.length === 0) {
            this.$emit("update:startDate", "");
            this.$emit("update:endDate", "");
            return;
          }
          if (selectedDates.length === 2) {
            const startDate = this.formatDate(selectedDates[0]);
            const endDate = this.formatDate(selectedDates[1]);
            this.$emit("update:startDate", startDate);
            this.$emit("update:endDate", endDate);
            this.flatpickrInstance.close();
          }
        },
        onReady: function(selectedDates, dateStr, instance) {
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'custom-buttons-container';
          
          const todayBtn = document.createElement('button');
          todayBtn.innerHTML = '一天';
          todayBtn.className = 'flatpickr-button today-button';
          todayBtn.addEventListener('click', () => self.setToday());
          
          const weekBtn = document.createElement('button');
          weekBtn.innerHTML = '一周';
          weekBtn.className = 'flatpickr-button week-button';
          weekBtn.addEventListener('click', () => self.setWeek());
          
          const monthBtn = document.createElement('button');
          monthBtn.innerHTML = '一月';
          monthBtn.className = 'flatpickr-button month-button';
          monthBtn.addEventListener('click', () => self.setMonth());
          
          const clearBtn = document.createElement('button');
          clearBtn.innerHTML = '清除';
          clearBtn.className = 'flatpickr-button clear-button';
          clearBtn.addEventListener('click', () => self.clearDate());
          
          buttonContainer.appendChild(todayBtn);
          buttonContainer.appendChild(weekBtn);
          buttonContainer.appendChild(monthBtn);
          buttonContainer.appendChild(clearBtn);
          
          instance.calendarContainer.appendChild(buttonContainer);
        }
      });
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    setToday() {
      if (!this.disabled) {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        this.flatpickrInstance.setDate([today, tomorrow]);
        this.$emit("update:startDate", this.formatDate(today));
        this.$emit("update:endDate", this.formatDate(tomorrow));
        this.flatpickrInstance.close();
      }
    },
    clearDate() {
      if (!this.disabled) {
        this.flatpickrInstance.clear();
        this.$emit("update:startDate", "");
        this.$emit("update:endDate", "");
        this.flatpickrInstance.close();
      }
    },
    setWeek() {
      if (!this.disabled) {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        this.flatpickrInstance.setDate([today, nextWeek]);
        this.$emit("update:startDate", this.formatDate(today));
        this.$emit("update:endDate", this.formatDate(nextWeek));
        this.flatpickrInstance.close();
      }
    },
    setMonth() {
      if (!this.disabled) {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        
        this.flatpickrInstance.setDate([today, nextMonth]);
        this.$emit("update:startDate", this.formatDate(today));
        this.$emit("update:endDate", this.formatDate(nextMonth));
        this.flatpickrInstance.close();
      }
    }
  },
  watch: {
    startDate(newVal) {
      if (this.flatpickrInstance && newVal) {
        const endDate = this.endDate || "";
        this.flatpickrInstance.setDate([newVal, endDate].filter(Boolean), false);
      }
    },
    endDate(newVal) {
      if (this.flatpickrInstance && newVal) {
        const startDate = this.startDate || "";
        this.flatpickrInstance.setDate([startDate, newVal].filter(Boolean), false);
      }
    },
    disabled(newVal) {
      if (this.flatpickrInstance) {
        if (newVal) {
          this.flatpickrInstance.set('disable', [() => true]);
        } else {
          this.flatpickrInstance.set('disable', []);
        }
      }
    }
  },
  beforeDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
};
</script>

<style>
/* 使用与 DatePicker 相同的样式 */
.custom-buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    gap: 8px; /* 添加按钮之间的间距 */
}

.flatpickr-button {
    flex: 1; /* 让所有按钮平均分配空间 */
    padding: 6px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    min-width: 60px; /* 设置最小宽度确保按钮不会太窄 */
}

.flatpickr-button:hover {
    background: #9333ea;
    color: white;
    border-color: #9333ea;
}

.flatpickr-button:active {
    transform: scale(0.98);
}

/* 禁用时的样式 */
.flatpickr-input[disabled] ~ .flatpickr-calendar .flatpickr-button {
    opacity: 0.5;
    cursor: not-allowed;
}
</style> 