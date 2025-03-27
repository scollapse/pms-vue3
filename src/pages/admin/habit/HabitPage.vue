<template>
  <div class="px-6 py-6 min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
    <!-- 页面顶部操作栏 -->
    <div class="mb-6 flex justify-between items-center">
      <!-- 积分显示 -->
      <div class="flex items-center">
        <div class="flex items-center bg-blue-50 px-4 py-2 rounded-lg shadow-sm">
          <HabitIcon name="currency-dollar" color="yellow" class="mr-2" />
          <span class="font-semibold text-gray-800">{{ habitStore.userPoints }} 积分</span>
        </div>
      </div>
      
      <!-- 日期选择器 -->
      <div class="flex items-center gap-3">
        <button 
          @click="setDate(getPreviousDay())" 
          class="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <HabitIcon name="chevron-left" />
        </button>
        
        <DatePicker 
          v-model="selectedDate" 
          :min-date="minDate"
          :max-date="maxDate"
          @update:model-value="onDateChange"
          ref="datePicker"
          :clearable="false"
          @clear="clearDate"
        />
        
        <button 
          @click="setDate(getNextDay())" 
          :disabled="isToday" 
          class="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HabitIcon name="chevron-right" />
        </button>
      </div>

      <!-- 功能快捷入口 -->
      <div class="flex items-center gap-3">
        <router-link 
          to="/admin/habit/achievement" 
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-200 text-gray-700 hover:text-blue-600"
        >
          <HabitIcon name="trophy" color="blue" />
          <span class="text-sm font-medium">成就</span>
        </router-link>
        
        <router-link 
          to="/admin/habit/store" 
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-200 text-gray-700 hover:text-green-600"
        >
          <HabitIcon name="shopping-bag" color="green" />
          <span class="text-sm font-medium">商城</span>
        </router-link>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 gap-6">
      <!-- 第一行：统计卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 今日进度 -->
        <StatisticCard 
          title="今日进度" 
          :value="`${todayProgress.completed}/${todayProgress.total}`" 
          icon="chart-pie"
          color="purple"
          :showProgress="true"
          progressLabel="完成率"
          :progressPercentage="todayProgress.percentage"
          class="card-hover-effect"
        />
        
        <!-- 连续打卡 -->
        <StatisticCard 
          title="连续打卡" 
          :value="habitStore.streakDays" 
          unit="天" 
          icon="fire"
          color="red"
          class="card-hover-effect"
        />
        
        <!-- 本周完成率 -->
        <StatisticCard 
          title="本周完成率" 
          :value="habitStore.weeklyCompletionRate" 
          unit="%" 
          icon="chart-bar" 
          color="blue"
          :showProgress="true"
          progressLabel="进度"
          :progressPercentage="habitStore.weeklyCompletionRate"
          class="card-hover-effect"
        />
      </div>
      
      <!-- 第二行：热力图、成就和商城卡片并排 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 热力图 -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-50 card-hover-effect">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">打卡热力图</h2>
          </div>
          <CalendarHeatmap 
            :end-date="new Date()" 
            :values="habitStore.heatmapData" 
            color-range="['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']"
            :tooltip="true" 
            tooltip-unit="完成率"
          />
        </div>
        
        <!-- 成就卡片 -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-50 card-hover-effect">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">我的成就</h2>
            <router-link to="/admin/habit/achievement" class="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center">
              <span>查看全部</span>
              <HabitIcon name="chevron-right" color="blue" size="sm" class="ml-1" />
            </router-link>
          </div>
          
          <div class="space-y-3">
            <div v-for="achievement in latestAchievements" :key="achievement.id"
              class="flex items-center p-3 rounded-lg border border-gray-100 hover:border-blue-100 transition-all duration-200 bg-gray-50">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                :class="achievement.unlocked ? 'bg-blue-100' : 'bg-gray-100'">
                <HabitIcon :name="achievement.icon" :color="achievement.unlocked ? 'blue' : 'gray'" />
              </div>
              <div class="flex-1">
                <div class="flex items-center">
                  <h3 class="text-base font-medium text-gray-800">{{ achievement.name }}</h3>
                  <span v-if="achievement.unlocked" class="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">已解锁</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div class="h-1.5 rounded-full bg-blue-500" :style="{ width: `${(achievement.progress / achievement.total) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 奖励卡片 -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-50 card-hover-effect">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">奖励商城</h2>
            <router-link to="/admin/habit/store" class="text-sm text-green-500 hover:text-green-600 font-medium flex items-center">
              <span>查看全部</span>
              <HabitIcon name="chevron-right" color="green" size="sm" class="ml-1" />
            </router-link>
          </div>
          
          <div class="space-y-3">
            <div v-for="reward in availableRewards" :key="reward.id"
              class="flex items-center p-3 rounded-lg border border-gray-100 hover:border-green-100 transition-all duration-200 bg-gray-50">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-green-100">
                <HabitIcon :name="getRewardIcon(reward.icon)" color="green" />
              </div>
              <div class="flex-1">
                <h3 class="text-base font-medium text-gray-800">{{ reward.name }}</h3>
                <div class="flex items-center mt-1">
                  <HabitIcon name="currency-dollar" color="yellow" size="sm" class="mr-1" />
                  <span class="text-sm font-medium text-gray-600">{{ reward.cost }} 积分</span>
                </div>
              </div>
              <button 
                @click="redeemReward(reward.id)"
                :disabled="habitStore.userPoints < reward.cost"
                class="px-3 py-1 text-xs font-medium rounded-lg"
                :class="habitStore.userPoints >= reward.cost 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
              >
                兑换
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 第三行：习惯列表（按类别分组） -->
      <div>
        <div class="grid grid-cols-1 gap-6">
          <HabitCardWrapper 
            v-for="category in categoryList" 
            :key="category" 
            :title="category" 
            :icon="getCategoryIcon(category)" 
            :color="getCategoryColor(category)"
            :habits="getCategoryHabits(category)"
            class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-50"
          >
            <template #action>
              <button 
                @click="habitModal.open(category)"
                class="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <HabitIcon name="plus" color="blue" size="sm" />
                <span>添加{{ category }}习惯</span>
              </button>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <HabitCard 
                v-for="habit in getCategoryHabits(category)" 
                :key="habit.id"
                :habit="habit"
                @update="updateHabit"
              />
            </div>
          </HabitCardWrapper>
        </div>
      </div>
    </div>

    <!-- 添加习惯的模态框组件 -->
    <HabitModal ref="habitModal" @habit-added="onHabitAdded" />


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useHabitStore } from '@/stores/habit';
import dayjs from 'dayjs';
import CalendarHeatmap from '@/components/CalendarHeatmap.vue';
import StatisticCard from '@/components/habit/StatisticCard.vue';
import HabitCard from '@/components/habit/HabitCard.vue';
import HabitIcon from '@/components/habit/HabitIcon.vue';
import HabitCardWrapper from '@/components/habit/HabitCardWrapper.vue';
import HabitModal from '@/components/habit/HabitModal.vue';
import DatePicker from '@/components/DatePicker.vue';

const habitStore = useHabitStore();
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const clearDate = () => {
  selectedDate.value = dayjs().format('YYYY-MM-DD');
};
const minDate = ref(dayjs().subtract(1, 'year').format('YYYY-MM-DD'));
const maxDate = ref(dayjs().format('YYYY-MM-DD'));
const habitModal = ref();
const datePicker = ref();

// 添加习惯的点击外部事件处理
onMounted(() => {
  habitStore.setSelectedDate(selectedDate.value);
});

// 设置日期
const setDate = (date) => {
  selectedDate.value = date;
  habitStore.setSelectedDate(date);
};

// 获取前一天
const getPreviousDay = () => {
  return dayjs(selectedDate.value).subtract(1, 'day').format('YYYY-MM-DD');
};

// 获取后一天
const getNextDay = () => {
  return dayjs(selectedDate.value).add(1, 'day').format('YYYY-MM-DD');
};

// 日期变更处理
const onDateChange = (date) => {
  habitStore.setSelectedDate(date);
};

// 是否为今天
const isToday = computed(() => {
  return dayjs(selectedDate.value).isSame(dayjs(), 'day');
});

// 今日进度
const todayProgress = computed(() => {
  return habitStore.todayProgress;
});

// 类别列表
const categoryList = computed(() => {
  return habitStore.categories;
});

// 获取特定类别的习惯
const getCategoryHabits = (category) => {
  return habitStore.habitsByDate.filter(habit => habit.category === category);
};

// 获取类别图标
const getCategoryIcon = (category) => {
  const iconMap = {
    '健康': 'heart',
    '学习': 'academic-cap',
    '工作': 'briefcase',
    '生活': 'home',
    '娱乐': 'music-note',
    '阅读': 'book-open',
    '默认': 'collection'
  };
  return iconMap[category] || 'collection';
};

// 获取类别颜色
const getCategoryColor = (category) => {
  const colorMap = {
    '健康': 'red',
    '学习': 'indigo',
    '工作': 'blue',
    '生活': 'green',
    '娱乐': 'purple',
    '阅读': 'yellow',
    '默认': 'gray'
  };
  return colorMap[category] || 'gray';
};

// 更新习惯
const updateHabit = (updatedHabit) => {
  // 切换习惯状态，让Store处理完成状态的变更和积分更新
  habitStore.toggleHabitStatus(updatedHabit);
};

// 添加习惯处理
const onHabitAdded = (newHabit) => {
  // 在实际应用中，这里会调用API保存数据
  console.log('添加新习惯:', newHabit);
  // habitStore.addHabit(newHabit);
};

// 最新成就（只显示前3个）
const latestAchievements = computed(() => {
  return habitStore.achievements && Array.isArray(habitStore.achievements) ? habitStore.achievements.slice(0, 3) : [];
});

// 可兑换的奖励（只显示前3个）
const availableRewards = computed(() => {
  return habitStore.rewards && Array.isArray(habitStore.rewards) ? habitStore.rewards
    .filter(r => !r.redeemed)
    .slice(0, 3) : [];
});

// 奖励图标映射
const rewardIconMap = {
  'gift': 'gift',
  'trophy': 'trophy',
  'sparkles': 'wand-sparkles',
  'heart': 'heart',
  'star': 'star',
  'ticket': 'ticket',
  'book': 'book-open',
  'film': 'film',
  'cake': 'cake',
};

// 获取奖励图标
const getRewardIcon = (iconName) => {
  return rewardIconMap[iconName] || 'gift';
};

// 兑换奖励
const redeemReward = (rewardId) => {
  const success = habitStore.redeemReward(rewardId);
  if (success) {
    // 可以添加成功提示
    alert('奖励兑换成功！');
  }
};
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

.ripple {
  animation: ripple-effect 0.6s linear;
}

@keyframes ripple-effect {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* 卡片悬浮效果 */
.card-hover-effect {
  transition: all 0.3s ease-in-out;
  box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.2);
}

.card-hover-effect:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.4);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(37, 99, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}
</style>
