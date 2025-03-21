<template>
  <div class="health-page bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 h-screen flex overflow-hidden shadow-sm">
    <div class="flex-grow overflow-hidden">
      <!-- 标签页导航 -->
      <div class="mb-6 flex items-center border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          <li class="mr-4" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200" 
                    :class="[
                      activeTab === 'physical'
                        ? 'text-indigo-600 border-indigo-600 font-semibold'
                        : 'text-gray-500 hover:text-indigo-500 hover:border-indigo-300 border-transparent'
                    ]" 
                    @click="activeTab = 'physical'" 
                    role="tab">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                身体素质
              </div>
            </button>
          </li>
          <li class="mr-4" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-lg transition-all duration-200" 
                    :class="[
                      activeTab === 'diet'
                        ? 'text-indigo-600 border-indigo-600 font-semibold'
                        : 'text-gray-500 hover:text-indigo-500 hover:border-indigo-300 border-transparent'
                    ]" 
                    @click="activeTab = 'diet'" 
                    role="tab">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                饮食管理
              </div>
            </button>
          </li>
        </ul>
      </div>

      <!-- 标签页内容 -->
      <div class="tab-content overflow-auto h-[calc(100%-80px)]">
        <!-- 身体素质模块 -->
        <div v-show="activeTab === 'physical'" role="tabpanel" class="flex fade-in">
          <div class="flex-grow overflow-auto">
            <PhysicalHealth />
          </div>
        </div>

        <!-- 饮食管理模块 -->
        <div v-show="activeTab === 'diet'" role="tabpanel" class="flex fade-in">
          <div class="flex-grow overflow-auto">
            <DietManagement />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 健康管理模块主页面
 * 整合身体素质、饮食管理、睡眠监测和健康报告四个子模块
 * @author AI Developer
 * @date 2023-05-15
 */
import { ref, onMounted } from 'vue'
import PhysicalHealth from './PhysicalHealth.vue'
import DietManagement from './DietManagement.vue'

// 当前激活的标签页
const activeTab = ref('physical')

// 组件挂载时的初始化操作
onMounted(() => {
  // 可以在这里添加初始化逻辑，如从本地存储恢复上次查看的标签页等
})
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 242, 243, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* 标签页切换动画 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>