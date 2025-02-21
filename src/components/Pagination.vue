<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
    <!-- 数据信息 -->
    <div class="text-sm text-gray-600">
      总数据量：{{ total }} | 每页：{{ pageSize }} | 当前页：{{ currentPage }}
    </div>
    <!-- 分页 -->
    <nav aria-label="Page navigation example">
      <ul class="inline-flex -space-x-px text-sm">
        <!-- 上一页 -->
        <li>
          <button
            @click="handlePrev"
            :disabled="currentPage === 1"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-white bg-purple-500  border border-e-0 border-gray-300 rounded-s-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            上一页
          </button>
        </li>
        <!-- 页码 -->
        <li
          v-for="page in pages"
          :key="page"
          :class="{'bg-purple-50 text-purple-600': page === currentPage, 'text-gray-500 hover:text-purple-700': page !== currentPage}"
        >
            <button
            @click="handlePageClick(page)"
            :class="{'flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300 hover:bg-purple-100 rounded': true, 'text-purple-800 font-bold': page === currentPage}"
          >
            {{ page }}
          </button>
        </li>
        <!-- 下一页 -->
        <li>
          <button
            @click="handleNext"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-white bg-purple-500 border border-e-0 border-gray-300 rounded-e-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </li>
      </ul>
    </nav>
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