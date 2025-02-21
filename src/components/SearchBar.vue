<template>
    <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
      <div class="flex space-x-4">
        <template v-for="(field, index) in fields" :key="index">
          <div v-if="field.type === 'input'" class="flex space-x-4">
            <template v-for="(value, idx) in field.values" :key="idx">
              <input
                type="text"
                v-model="filters[value.key]"
                :placeholder="'请输入' + value.value"
                class="w-48 px-3 py-2 text-sm border-2 border-purple-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-purple-400"
              />
            </template>
          </div>
          <div v-else-if="field.type === 'daterangePicker'" class="flex space-x-4">
            <template v-for="(value, idx) in field.values" :key="idx">
              <div class="flex items-center">
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                      />
                    </svg>
                  </div>
                  <input
                    :id="getDatePickerId(value.key)"
                    type="text"
                    class="text-sm border-2 border-purple-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-purple-400 block w-60 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    :placeholder="'请选择' + value.value + '日期范围'"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
        <!-- 搜索按钮 -->
        <button
          @click="handleSearch"
          class="px-4 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700"
        >
          搜索
        </button>
      </div>
  
      <!-- 重置按钮 -->
      <button
        @click="handleReset"
        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300"
      >
        重置
      </button>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.min.css'; // 引入 flatpickr 的 CSS
  
  export default {
    props: {
      fields: {
        type: Array,
        required: true,
      },
      filters: {
        type: Object,
        required: true,
      },
      refresh: {
        type: Function,
        required: true,
      },
    },
    methods: {
      handleSearch() {
        // 调用分页组件的刷新方法，并传递最新的 filters
        this.refresh(this.filters);
      },
      handleReset() {
        // 清空 filters 数据
        for (const key in this.filters) {
          this.filters[key] = '';
        }
  
        // 清空日期选择器的显示
        this.fields.forEach((field) => {
          if (field.type === 'daterangePicker') {
            field.values.forEach((value) => {
              const datepicker = flatpickr(`#${this.getDatePickerId(value.key)}`);
              if (datepicker) {
                datepicker.clear();
              }
            });
          }
        });
  
        // 调用分页组件的刷新方法，并传递最新的 filters
        this.refresh(this.filters);
      },
      getDatePickerId(value) {
        return value === '' ? 'datepicker-range' : 'datepicker-' + value + '-range';
      },
      initDatePickers() {
        this.fields.forEach((field) => {
          if (field.type === 'daterangePicker') {
            field.values.forEach((value) => {
              flatpickr(`#${this.getDatePickerId(value.key)}`, {
                mode: 'range', // 启用日期范围选择
                dateFormat: 'Y-m-d', // 实际日期格式
                onClose: (selectedDates) => {
                  if (selectedDates.length === 2) {
                    if (value.key === '') {
                      this.filters.startDate = flatpickr.formatDate(selectedDates[0], 'Y-m-d');
                      this.filters.endDate = flatpickr.formatDate(selectedDates[1], 'Y-m-d');
                    } else {
                      const startKey = value.key + 'StartDate';
                      this.filters[startKey] = flatpickr.formatDate(selectedDates[0], 'Y-m-d');
                      const endKey = value.key + 'EndDate';
                      this.filters[endKey] = flatpickr.formatDate(selectedDates[1], 'Y-m-d');
                    }
                  }
                },
              });
            });
          }
        });
      },
    },
    mounted() {
      this.initDatePickers();
    },
  };
  </script>