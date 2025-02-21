<template>
    <div class="relative">
      <input
        type="text"
        ref="dateInput"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
    name: 'DatePicker',
    props: {
      modelValue: { type: [String, Date], default: "" },
      placeholder: { type: String, default: "选择日期" },
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
          dateFormat: "Y-m-d",
          defaultDate: this.modelValue || null,
          minDate: this.minDate,
          maxDate: this.maxDate,
          disable: this.disabled ? [() => true] : [],
          disableMobile: true,
          allowInput: true,
          onChange: (selectedDates) => {
            const date = selectedDates[0] ? selectedDates[0].toISOString().split('T')[0] : "";
            this.$emit("update:modelValue", date);
          },
          onReady: function(selectedDates, dateStr, instance) {
            // 创建自定义按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'custom-buttons-container';
            
            // 创建今天按钮
            const todayBtn = document.createElement('button');
            todayBtn.innerHTML = '今天';
            todayBtn.className = 'flatpickr-button today-button';
            todayBtn.addEventListener('click', () => self.setToday());
            
            // 创建清除按钮
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '清除';
            clearBtn.className = 'flatpickr-button clear-button';
            clearBtn.addEventListener('click', () => self.clearDate());
            
            // 添加按钮到容器
            buttonContainer.appendChild(todayBtn);
            buttonContainer.appendChild(clearBtn);
            
            // 将按钮容器添加到日历面板中
            instance.calendarContainer.appendChild(buttonContainer);
          }
        });
      },
      // 新增方法：设置为今天
      setToday() {
        if (!this.disabled) {
          const today = new Date();
          this.flatpickrInstance.setDate(today);
          this.$emit("update:modelValue", today.toISOString().split('T')[0]);
        }
      },
      // 新增方法：清除日期
      clearDate() {
        if (!this.disabled) {
          this.flatpickrInstance.clear();
          this.$emit("update:modelValue", "");
        }
      }
    },
    watch: {
      modelValue: {
        handler(newVal) {
          if (this.flatpickrInstance && newVal) {
            try {
              const date = typeof newVal === 'string' ? newVal : newVal.toISOString().split('T')[0];
              this.flatpickrInstance.setDate(date, false);
            } catch (e) {
              console.warn('Invalid date value:', newVal);
              this.flatpickrInstance.clear();
            }
          } else if (this.flatpickrInstance) {
            this.flatpickrInstance.clear();
          }
        },
        immediate: true
      },
      disabled(newVal) {
        if (this.flatpickrInstance) {
          if (newVal) {
            this.flatpickrInstance.set('disable', [() => true]);
          } else {
            this.flatpickrInstance.set('disable', []);
          }
        }
      },
      minDate(newVal) {
        if (this.flatpickrInstance) {
          this.flatpickrInstance.set('minDate', newVal);
        }
      },
      maxDate(newVal) {
        if (this.flatpickrInstance) {
          this.flatpickrInstance.set('maxDate', newVal);
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
/* 自定义日期选择器样式 */
.flatpickr-calendar {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.flatpickr-day.selected {
    background: #9333ea !important;
    border-color: #9333ea !important;
}

.flatpickr-day.today {
    border-color: #9333ea;
}

.flatpickr-day:hover {
    background: #f3e8ff;
}

/* 新增自定义按钮样式 */
.custom-buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.flatpickr-button {
    padding: 6px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
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