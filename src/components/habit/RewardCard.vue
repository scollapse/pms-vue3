<template>
  <div 
    class="reward-card rounded-xl border overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1"
    :class="[
      canPurchase 
        ? 'bg-white border-green-100 shadow-sm hover:shadow-md' 
        : 'bg-white border-gray-50 shadow-sm hover:shadow'
    ]"
  >
    <!-- 奖励内容区域 -->
    <div class="p-5">
      <div class="flex items-center mb-4">
        <!-- 图标区域 -->
        <div 
          class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
          :class="canPurchase ? 'bg-green-50' : 'bg-gray-50'"
        >
          <component 
            :is="getIconComponent(reward.icon)" 
            class="w-7 h-7"
            :class="canPurchase ? 'text-green-600' : 'text-gray-400'"
          />
        </div>
        
        <!-- 标题和描述 -->
        <div class="flex-1">
          <div class="flex items-center">
            <h3 
              class="text-lg font-semibold" 
              :class="canPurchase ? 'text-gray-800' : 'text-gray-600'"
            >
              {{ reward.name }}
            </h3>
            <span 
              v-if="reward.redeemed" 
              class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
            >
              已兑换
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ reward.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 底部价格和兑换按钮区域 -->
    <div 
      class="p-3 flex items-center justify-between border-t"
      :class="canPurchase ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'"
    >
      <div class="flex items-center">
        <CurrencyDollarIcon class="h-5 w-5 text-yellow-500 mr-1" />
        <span class="text-base font-semibold" :class="canPurchase ? 'text-gray-700' : 'text-gray-400'">
          {{ reward.cost }} 积分
        </span>
      </div>
      
      <button 
        @click="$emit('redeem', reward.id)" 
        :disabled="!canPurchase || reward.redeemed"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        :class="buttonClasses"
      >
        {{ reward.redeemed ? '已兑换' : '兑换' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { 
  CurrencyDollarIcon, 
  GiftIcon, 
  TrophyIcon, 
  SparklesIcon, 
  HeartIcon, 
  StarIcon,
  TicketIcon,
  BookOpenIcon
} from '@heroicons/vue/24/solid';

const props = defineProps({
  reward: {
    type: Object,
    required: true
  },
  userPoints: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['redeem']);

const canPurchase = computed(() => {
  return props.userPoints >= props.reward.cost && !props.reward.redeemed;
});

const buttonClasses = computed(() => {
  if (props.reward.redeemed) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed';
  }
  if (canPurchase.value) {
    return 'bg-green-500 hover:bg-green-600 text-white';
  }
  return 'bg-gray-100 text-gray-400 cursor-not-allowed';
});

const iconMap = {
  'gift': GiftIcon,
  'trophy': TrophyIcon,
  'sparkles': SparklesIcon,
  'heart': HeartIcon,
  'star': StarIcon,
  'ticket': TicketIcon,
  'book': BookOpenIcon,
  'dollar': CurrencyDollarIcon
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || GiftIcon;
};
</script>

<style scoped>
.reward-card {
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transform: translateY(0);
}

.reward-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
}
</style>