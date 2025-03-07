<template>
  <div class="flex items-center justify-between p-2 bg-white rounded-xl shadow-md">
    <!-- 上一页按钮 -->
    <button 
      @click="handlePrev" 
      :disabled="currentPage === 1"
      class="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- 中间区域：页码和分页信息 -->
    <div class="flex flex-col items-center space-y-1">
      <!-- 页码按钮 -->
      <div class="flex space-x-1">
        <button
          v-for="page in pages"
          :key="page"
          @click="handlePageClick(page)"
          :class="[
            'w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-200 text-sm',
            currentPage === page 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ page }}
        </button>
      </div>
      <!-- 分页信息 -->
      <div class="text-xs text-gray-600">
        {{ totalPages === 0 ? '0 / 0' : `${currentPage} / ${totalPages}` }} 页 | 共 {{ total }} 条
      </div>
    </div>

    <!-- 下一页按钮 -->
    <button 
      @click="handleNext" 
      :disabled="currentPage === totalPages || totalPages === 0"
      class="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: {
    loadData: {
      type: Function,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const total = ref(0); // 默认总数据量
    const pageSize = ref(10); // 默认每页大小
    const currentPage = ref(1); // 默认当前页

    const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

    const pages = computed(() => {
      const pagesArray = [];
      for (let i = 1; i <= totalPages.value; i++) {
        pagesArray.push(i);
      }
      return pagesArray;
    });

    const handlePrev = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
        props.loadData(currentPage.value, pageSize.value, props.filters, setTotal);
      }
    };

    const handleNext = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        props.loadData(currentPage.value, pageSize.value, props.filters, setTotal);
      }
    };

    const handlePageClick = (page) => {
      currentPage.value = page;
      props.loadData(page, pageSize.value, props.filters, setTotal);
    };

    // 设置总数据量
    const setTotal = (newTotal) => {
      total.value = newTotal;
    };

    // 暴露刷新方法
    const refresh = (newFilters) => {
      currentPage.value =  1; // 重置当前页
      props.filters = { ...newFilters }; // 更新 filters
      props.loadData(currentPage.value, pageSize.value, props.filters, setTotal);
    };

    // 暴露 setTotal 方法
    return {
      total,
      pageSize,
      currentPage,
      totalPages,
      pages,
      handlePrev,
      handleNext,
      handlePageClick,
      refresh,
      setTotal, // 暴露 setTotal 方法
    };
  },
};
</script>