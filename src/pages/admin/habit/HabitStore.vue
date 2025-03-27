<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
    <!-- 页面标题和导航栏 -->
    <div class="px-6 py-4 border-b border-gray-200  shadow-sm sticky top-0 z-10">
      <div class=" mx-auto w-full">
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
            <h1 class="text-xl font-bold text-gray-800">奖励商城</h1>
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
    
    <div class=" mx-auto w-full px-4 md:px-6 py-6">
      <!-- 商城概览 -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <!-- 总奖励数 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">可用奖励</p>
                <p class="text-xl font-bold text-gray-800">{{ availableRewardsCount }}</p>
              </div>
            </div>
          </div>
          
          <!-- 已兑换奖励 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">已兑换</p>
                <p class="text-xl font-bold text-gray-800">{{ redeemedRewardsCount }}</p>
              </div>
            </div>
          </div>
          
          <!-- 积分消费 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
            <div class="flex items-center mb-3">
              <div class="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">已消费积分</p>
                <p class="text-xl font-bold text-gray-800">{{ spentPoints }}</p>
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
          全部奖励
        </button>
        <button 
          @click="activeFilter = 'available'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'available' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          可兑换
        </button>
        <button 
          @click="activeFilter = 'purchased'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'purchased' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          已兑换
        </button>
        <button 
          @click="activeFilter = 'affordable'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'affordable' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          积分足够
        </button>
        <button 
          @click="activeFilter = 'unaffordable'" 
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeFilter === 'unaffordable' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'"
        >
          积分不足
        </button>
      </div>
      
      <!-- 奖励列表 -->
      <div v-if="filteredRewards.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <div v-for="reward in filteredRewards" :key="reward.id"
            class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 border hover:shadow-md transform hover:-translate-y-1"
            :class="[
              reward.redeemed 
                ? 'border-blue-200 ring-1 ring-blue-100' 
                : canRedeem(reward) 
                  ? 'border-green-200 ring-1 ring-green-100' 
                  : 'border-gray-100'
            ]"
          >
            <div class="p-6">
              <!-- 奖励标题和状态 -->
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-bold text-gray-800">{{ reward.name }}</h3>
                <span 
                  v-if="reward.redeemed" 
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  已兑换
                </span>
                <span 
                  v-else-if="canRedeem(reward)" 
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  可兑换
                </span>
              </div>
              
              <!-- 奖励图标和描述 -->
              <div class="flex items-start mb-4">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                  :class="getIconBgColor(reward)"
                >
                  <component 
                    :is="getRewardIcon(reward.icon)" 
                    class="w-6 h-6"
                    :class="getIconColor(reward)"
                  />
                </div>
                <p class="text-gray-600">{{ reward.description }}</p>
              </div>
              
              <!-- 底部信息和按钮 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                  <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-semibold text-gray-800">{{ reward.cost }} 积分</span>
                </div>
                
                <button 
                  v-if="!reward.redeemed"
                  @click="redeemReward(reward.id)"
                  :disabled="!canRedeem(reward)"
                  class="px-4 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center"
                  :class="canRedeem(reward) 
                    ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105' 
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ canRedeem(reward) ? '立即兑换' : `还需${reward.cost - habitStore.userPoints}积分` }}
                </button>
                <div 
                  v-else
                  class="flex items-center text-blue-600"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="font-medium">已成功兑换</span>
                </div>
              </div>
            </div>
            
            <!-- 底部信息区域 -->
            <div 
              class="px-4 py-2 border-t text-xs font-medium flex justify-between items-center"
              :class="getFooterBgClass(reward)"
            >
              <span>{{ getFooterLeftText(reward) }}</span>
              <span class="font-semibold">
                {{ reward.redeemed ? '兑换日期：2023-06-15' : '有效期：无限期' }}
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
        <p class="text-gray-500">继续坚持习惯打卡，获取更多积分！</p>
        <button 
          @click="activeFilter = 'all'"
          class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          查看全部奖励
        </button>
      </div>
      
      <!-- 兑换成功提示 -->
      <div 
        v-if="showSuccessMessage" 
        class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center success-animation z-50"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>奖励兑换成功！</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useHabitStore } from '@/stores/habit';
import { 
  CurrencyDollarIcon, 
  GiftIcon, 
  TrophyIcon, 
  SparklesIcon, 
  HeartIcon, 
  StarIcon,
  TicketIcon,
  BookOpenIcon,
  FilmIcon,
  CakeIcon
} from '@heroicons/vue/24/solid';

const habitStore = useHabitStore();
const activeFilter = ref('all');
const showSuccessMessage = ref(false);

// 可用奖励数量
const availableRewardsCount = computed(() => {
  return habitStore.rewards.filter(r => !r.redeemed).length;
});

// 已兑换奖励数量
const redeemedRewardsCount = computed(() => {
  return habitStore.rewards.filter(r => r.redeemed).length;
});

// 已消费积分
const spentPoints = computed(() => {
  return habitStore.rewards
    .filter(r => r.redeemed)
    .reduce((sum, r) => sum + r.cost, 0);
});

// 奖励图标映射
const rewardIconMap = {
  'gift': GiftIcon,
  'trophy': TrophyIcon,
  'sparkles': SparklesIcon,
  'heart': HeartIcon,
  'star': StarIcon,
  'ticket': TicketIcon,
  'book': BookOpenIcon,
  'film': FilmIcon,
  'cake': CakeIcon
};

// 根据筛选条件过滤奖励
const filteredRewards = computed(() => {
  if (activeFilter.value === 'all') {
    return habitStore.rewards;
  } else if (activeFilter.value === 'available') {
    return habitStore.rewards.filter(r => !r.redeemed && habitStore.userPoints >= r.cost);
  } else if (activeFilter.value === 'purchased') {
    return habitStore.rewards.filter(r => r.redeemed);
  } else if (activeFilter.value === 'affordable') {
    return habitStore.rewards.filter(r => !r.redeemed && habitStore.userPoints >= r.cost);
  } else if (activeFilter.value === 'unaffordable') {
    return habitStore.rewards.filter(r => !r.redeemed && habitStore.userPoints < r.cost);
  } else {
    return habitStore.rewards;
  }
});

// 空状态提示消息
const emptyStateMessage = computed(() => {
  if (activeFilter.value === 'available') {
    return '暂无可兑换的奖励';
  } else if (activeFilter.value === 'purchased') {
    return '暂无已兑换的奖励';
  } else if (activeFilter.value === 'affordable') {
    return '暂无积分足够的奖励';
  } else if (activeFilter.value === 'unaffordable') {
    return '所有奖励都可以兑换';
  } else {
    return '暂无奖励';
  }
});

// 获取奖励图标
const getRewardIcon = (iconName) => {
  return rewardIconMap[iconName] || GiftIcon;
};

// 检查是否可以兑换奖励
const canRedeem = (reward) => {
  return !reward.redeemed && habitStore.userPoints >= reward.cost;
};

// 获取图标背景颜色
const getIconBgColor = (reward) => {
  if (reward.redeemed) {
    return 'bg-blue-50';
  } else if (canRedeem(reward)) {
    return 'bg-green-50';
  } else {
    return 'bg-gray-50';
  }
};

// 获取图标颜色
const getIconColor = (reward) => {
  if (reward.redeemed) {
    return 'text-blue-500';
  } else if (canRedeem(reward)) {
    return 'text-green-500';
  } else {
    return 'text-gray-400';
  }
};

// 获取底部区域背景类
const getFooterBgClass = (reward) => {
  if (reward.redeemed) {
    return 'bg-blue-50 border-blue-100';
  } else if (canRedeem(reward)) {
    return 'bg-green-50 border-green-100';
  } else {
    return 'bg-gray-50 border-gray-100';
  }
};

// 获取底部左侧文本
const getFooterLeftText = (reward) => {
  if (reward.redeemed) {
    return '已消费积分奖励';
  } else if (canRedeem(reward)) {
    return '积分足够，可以兑换';
  } else {
    return `还需要 ${reward.cost - habitStore.userPoints} 积分`;
  }
};

// 处理兑换奖励
const redeemReward = (rewardId) => {
  const success = habitStore.redeemReward(rewardId);
  
  if (success) {
    showSuccessMessage.value = true;
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};

// 监听积分变化，自动切换到可兑换标签
watch(() => habitStore.userPoints, (newPoints) => {
  // 仅当用户在"不可兑换"页面且有积分可以兑换某些奖励时
  if (activeFilter.value === 'unaffordable' && 
      habitStore.rewards.some(r => !r.redeemed && newPoints >= r.cost)) {
    activeFilter.value = 'affordable';
  }
});
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 