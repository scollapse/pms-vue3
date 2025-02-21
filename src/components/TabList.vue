<template>
  <div class="pl-2 border-b border-gray-200 bg-purple-100 shadow flex justify-between items-center">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
      <li
        v-for="tab in tabStore.tabs"
        :key="tab.path"
        class="mr-2 flex items-center"
      >
        <div
          :class="[
            'inline-block p-4 rounded-3xl border-2 transition flex items-center',
            tabStore.activeTab === tab.path
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-purple-400 hover:border-purple-400'
          ]"
        >
          <button @click="changeTab(tab.path)">
            {{ tab.title }}
          </button>
          <button
            v-if="tab.path !== '/admin/index'"
            class="ml-2 text-gray-500 hover:text-purple-200"
            @click="closeTab(tab.path)"
          >
            &times;
          </button>
        </div>
      </li>
    </ul>
    <div class="relative" style="right: 20px;" ref="dropdown">
      <button @click="toggleDropdown" class="text-gray-500 hover:text-purple-400">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <transition name="fade">
        <ul v-if="isDropdownOpen" class="absolute right-0 mt-2 w-28 bg-white text-gray-800 rounded-lg shadow-lg z-10">
          <li>
            <a @click="closeOtherTabs" class="block px-4 py-2 rounded-lg hover:bg-purple-100 cursor-pointer">关闭其他</a>
          </li>
          <li>
            <a @click="closeAllTabs" class="block px-4 py-2 rounded-lg hover:bg-purple-100 cursor-pointer">关闭全部</a>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { useTabList } from '@/composables/useTabList';

const { tabStore, isDropdownOpen, dropdown, toggleDropdown, changeTab, closeTab, closeOtherTabs, closeAllTabs } = useTabList();
</script>

<style scoped>
/* 添加必要的样式以优化布局 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>