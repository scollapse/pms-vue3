<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm">
    <!-- 顶部标签页 -->
    <div class="mb-6 bg-white p-4 rounded-3xl">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- 看板内容区域 -->
    <div>
      <TaskBoard v-show="activeTab === 'task'" />
      <ProjectBoard v-show="activeTab === 'project'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskBoard from './components/TaskBoard.vue'
import ProjectBoard from './components/ProjectBoard.vue'

// 标签页配置
const tabs = [
  { id: 'task', name: '任务看板' },
  { id: 'project', name: '项目看板' }
]
const activeTab = ref('task')
</script>