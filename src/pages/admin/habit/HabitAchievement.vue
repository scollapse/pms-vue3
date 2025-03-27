<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
    <!-- 页面标题和导航栏 -->
    <div class="px-6 py-4 border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div class="  mx-auto w-full">
        <div class="flex items-center justify-between">
          <!-- 返回按钮和标题 -->
          <div class="flex items-center">
            <router-link 
              to="/admin/habit/index" 
              class="mr-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <h1 class="text-xl font-bold text-gray-800">成就系统</h1>
          </div>
          
          <!-- 当前积分显示 -->
          <div class="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-gray-800 font-semibold">{{ habitStore.userPoints }} 积分</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class=" mx-auto  w-full px-4 md:px-6 py-6">
      <!-- 成就概览 -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <!-- 总成就数 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">总成就数</p>
                <p class="text-xl font-bold text-gray-800">{{ totalAchievements }}</p>
              </div>
            </div>
          </div>
          
          <!-- 解锁成就数 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">已解锁成就</p>
                <p class="text-xl font-bold text-gray-800">{{ unlockedAchievements }}</p>
              </div>
            </div>
          </div>
          
          <!-- 完成进度 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">完成进度</p>
                <p class="text-xl font-bold text-gray-800">{{ completionPercentage }}%</p>
              </div>
            </div>
            
            <!-- 进度条 -->
            <div class="mt-2">
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div 
                  class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative overflow-hidden"
                  :style="{ width: `${completionPercentage}%` }"
                >
                  <div class="absolute inset-0 bg-opacity-30 bg-white shimmer"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 总积分 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">获得奖励</p>
                <p class="text-xl font-bold text-gray-800">{{ totalRewards }} 积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分类标签 -->
      <div class="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button 
          @click="activeFilter = 'all'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          全部成就
        </button>
        <button 
          @click="activeFilter = 'unlocked'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'unlocked' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          已解锁
        </button>
        <button 
          @click="activeFilter = 'locked'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'locked' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          未解锁
        </button>
        <button 
          @click="activeFilter = 'claimed'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'claimed' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          已领取
        </button>
        <button 
          @click="activeFilter = 'unclaimed'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'unclaimed' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          待领取
        </button>
      </div>
      
      <!-- 成就列表 -->
      <div v-if="filteredAchievements.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <div v-for="achievement in filteredAchievements" :key="achievement.id"
            class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 border hover:shadow-md transform hover:-translate-y-1"
            :class="[
              achievement.unlocked 
                ? (achievement.rewardClaimed ? 'border-gray-200' : 'border-blue-200 ring-1 ring-blue-100') 
                : 'border-gray-100'
            ]"
          >
            <div class="p-6">
              <!-- 成就标题和状态 -->
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-bold text-gray-800">{{ achievement.name }}</h3>
                <span 
                  v-if="achievement.unlocked" 
                  class="px-2 py-1 text-xs font-semibold rounded-full flex items-center"
                  :class="achievement.rewardClaimed ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      v-if="achievement.rewardClaimed"
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                    <path 
                      v-else
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  {{ achievement.rewardClaimed ? '已领取' : '已解锁' }}
                </span>
              </div>
              
              <!-- 成就图标和描述 -->
              <div class="flex items-start mb-4">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                  :class="achievement.unlocked ? 'bg-blue-50' : 'bg-gray-50'"
                >
                  <svg 
                    class="w-6 h-6" 
                    :class="achievement.unlocked ? 'text-blue-500' : 'text-gray-400'"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      v-if="achievement.icon === 'trophy'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                    />
                    <path 
                      v-else-if="achievement.icon === 'sun'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                    <path 
                      v-else-if="achievement.icon === 'fire'" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                    />
                  </svg>
                </div>
                <p class="text-gray-600">{{ achievement.description }}</p>
              </div>
              
              <!-- 进度条 -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm text-gray-500">进度</span>
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-700">{{ achievement.progress }}/{{ achievement.total }}</span>
                    <span 
                      v-if="achievement.progress === achievement.total" 
                      class="ml-2 text-xs font-medium text-green-600"
                    >
                      完成
                    </span>
                  </div>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-500 ease-out relative"
                    :class="getProgressBarColor(achievement.progress / achievement.total)"
                    :style="{ width: `${(achievement.progress / achievement.total) * 100}%` }"
                  >
                    <div class="absolute inset-0 bg-opacity-30 bg-white shimmer"></div>
                  </div>
                </div>
              </div>
              
              <!-- 奖励和按钮 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                  <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-semibold text-gray-800">{{ achievement.reward }} 积分</span>
                </div>
                
                <button 
                  v-if="achievement.unlocked && !achievement.rewardClaimed"
                  @click="claimReward(achievement.id)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  领取奖励
                </button>
                <span 
                  v-else-if="achievement.unlocked && achievement.rewardClaimed"
                  class="px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  已领取
                </span>
                <span 
                  v-else
                  class="px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg"
                >
                  未解锁
                </span>
              </div>
            </div>
            
            <!-- 底部进度指示 -->
            <div 
              class="px-4 py-2 border-t text-xs font-medium flex justify-between items-center"
              :class="achievement.unlocked ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'"
            >
              <span>
                {{ achievement.unlocked ? '已达成' : `还需 ${achievement.total - achievement.progress} 步完成` }}
              </span>
              <span class="text-gray-500">
                {{ getProgressStatus(achievement) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="bg-white rounded-xl shadow-sm p-8 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ emptyStateMessage }}</h3>
        <p class="text-gray-500">继续坚持习惯打卡，解锁更多成就！</p>
      </div>
      
      <!-- 成功提示 -->
      <div 
        v-if="showSuccessMessage" 
        class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center success-animation z-50"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>积分奖励领取成功！</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useHabitStore } from '@/stores/habit';

const habitStore = useHabitStore();
const activeFilter = ref('all');
const showSuccessMessage = ref(false);

// 计算统计数据
const totalAchievements = computed(() => habitStore.achievements.length);
const unlockedAchievements = computed(() => habitStore.achievements.filter(a => a.unlocked).length);
const completionPercentage = computed(() => {
  return totalAchievements.value > 0 
    ? Math.round((unlockedAchievements.value / totalAchievements.value) * 100) 
    : 0;
});

// 总奖励积分
const totalRewards = computed(() => {
  return habitStore.achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.reward, 0);
});

// 根据筛选条件过滤成就
const filteredAchievements = computed(() => {
  if (activeFilter.value === 'all') {
    return habitStore.achievements;
  } else if (activeFilter.value === 'unlocked') {
    return habitStore.achievements.filter(a => a.unlocked);
  } else if (activeFilter.value === 'locked') {
    return habitStore.achievements.filter(a => !a.unlocked);
  } else if (activeFilter.value === 'claimed') {
    return habitStore.achievements.filter(a => a.unlocked && a.rewardClaimed);
  } else if (activeFilter.value === 'unclaimed') {
    return habitStore.achievements.filter(a => a.unlocked && !a.rewardClaimed);
  } else {
    return habitStore.achievements;
  }
});

// 空状态提示消息
const emptyStateMessage = computed(() => {
  if (activeFilter.value === 'unlocked') {
    return '暂无已解锁的成就';
  } else if (activeFilter.value === 'locked') {
    return '暂无未解锁的成就';
  } else if (activeFilter.value === 'claimed') {
    return '暂无已领取奖励的成就';
  } else if (activeFilter.value === 'unclaimed') {
    return '暂无可领取奖励的成就';
  } else {
    return '暂无成就';
  }
});

// 根据进度比例获取进度条颜色
const getProgressBarColor = (ratio) => {
  if (ratio >= 1) return 'bg-gradient-to-r from-green-400 to-green-600';
  if (ratio >= 0.7) return 'bg-gradient-to-r from-blue-400 to-blue-600';
  if (ratio >= 0.3) return 'bg-gradient-to-r from-blue-300 to-blue-500';
  return 'bg-gradient-to-r from-gray-300 to-blue-300';
};

// 获取成就进度状态
const getProgressStatus = (achievement) => {
  const ratio = achievement.progress / achievement.total;
  if (ratio >= 1) return '恭喜完成';
  if (ratio >= 0.7) return '即将完成';
  if (ratio >= 0.3) return '进行中';
  return '刚刚开始';
};

// 领取成就奖励
const claimReward = (achievementId) => {
  // 在实际应用中，这里需要调用API领取奖励
  // 目前暂时模拟实现
  const achievement = habitStore.achievements.find(a => a.id === achievementId);
  if (achievement && achievement.unlocked && !achievement.rewardClaimed) {
    // 增加用户积分
    habitStore.userPoints += achievement.reward;
    
    // 标记奖励已领取
    achievement.rewardClaimed = true;
    
    // 显示成功消息
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};
</script>

<style scoped>
.success-animation {
  animation: slideIn 0.5s ease-out forwards, fadeOut 0.5s ease-in 2.5s forwards;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
  background-size: 1000px 100%;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 