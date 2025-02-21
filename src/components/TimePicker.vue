<template>
    <div class="relative">
      <input
        type="text"
        ref="timeInput"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        :placeholder="placeholder"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
    </div>
  </template>
  
  <script>
  import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.min.css";
  
  export default {
    props: {
      value: { type: [String, Date], default: "" },
      placeholder: { type: String, default: "选择时间" }
    },
    data() {
      return {
        flatpickrInstance: null
      };
    },
    mounted() {
      this.flatpickrInstance = flatpickr(this.$refs.timeInput, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: this.value,
        onChange: (selectedDates) => {
          const time = selectedDates[0] ? selectedDates[0].toTimeString().slice(0,5) : "";
          this.$emit("input", time);
        }
      });
    },
    watch: {
      value(newVal) {
        this.flatpickrInstance.setDate(newVal);
      }
    },
    beforeDestroy() {
      this.flatpickrInstance.destroy();
    }
  };
  </script>