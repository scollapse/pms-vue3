<template>
    <div class="relative">
      <!-- 主要内容区 -->
      <div class="p-4 bg-gradient-to-b from-violet-50 to-white min-h-screen">
        <!-- 页面标题 -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">饮食管理</h1>
            <p class="text-gray-500 mt-1 flex items-center">
              <CalendarIcon class="w-4 h-4 mr-1" />
              {{ formatDate(currentDate) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              class="bg-violet-100 text-violet-700 hover:bg-violet-200 transition px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              @click="showFilterMenu = !showFilterMenu"
            >
              <FunnelIcon class="w-4 h-4 mr-1" />
              筛选食物
              <ChevronDownIcon class="w-4 h-4 ml-1" />
            </button>
            <button 
              class="bg-violet-600 text-white hover:bg-violet-700 transition px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              @click="showAddFoodForm = true"
            >
              <PlusIcon class="w-4 h-4 mr-1" />
              添加食物
            </button>
            
            <!-- 筛选菜单 -->
            <div 
              v-if="showFilterMenu" 
              class="absolute right-10 top-24 z-50 w-56 bg-white rounded-lg shadow-lg p-2 border border-gray-100"
            >
              <div 
                class="p-2 rounded-md cursor-pointer hover:bg-gray-50"
                :class="{'bg-violet-50 text-violet-700': activeFilter === 'all'}"
                @click="activeFilter = 'all'; showFilterMenu = false"
              >
                所有食物
              </div>
              <div 
                class="p-2 rounded-md cursor-pointer hover:bg-gray-50"
                :class="{'bg-violet-50 text-violet-700': activeFilter === 'protein'}"
                @click="activeFilter = 'protein'; showFilterMenu = false"
              >
                高蛋白食物
              </div>
              <div 
                class="p-2 rounded-md cursor-pointer hover:bg-gray-50"
                :class="{'bg-violet-50 text-violet-700': activeFilter === 'lowCarb'}"
                @click="activeFilter = 'lowCarb'; showFilterMenu = false"
              >
                低碳水食物
              </div>
            </div>
          </div>
        </div>
        
        <!-- 主要内容布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：膳食记录区域 -->
          <div class="lg:col-span-2">
            <!-- 膳食记录卡片 -->
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">今日膳食记录</h2>
              
              <div class="space-y-6">
                <!-- 每种膳食类型的卡片 -->
                <div v-for="meal in meals" :key="meal.type" class="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <!-- 膳食标题 -->
                  <div class="flex items-center p-4 border-b border-gray-100">
                    <div :class="`${getMealIconBg(meal.type)} p-2 rounded-full mr-3`">
                      <component :is="getMealIcon(meal.type)" class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-800">{{ meal.type }}</h3>
                      <p class="text-gray-500 text-sm">{{ meal.time }} • {{ meal.calories }}卡路里</p>
                    </div>
                  </div>
                  
                  <!-- 食物列表 -->
                  <div class="divide-y divide-gray-100">
                    <div 
                      v-for="(item, idx) in meal.items" 
                      :key="`${meal.type}-${idx}`"
                      class="flex items-center p-4 hover:bg-gray-50"
                    >
                      <div class="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img :src="item.image" class="w-full h-full object-cover" alt="食物图片" />
                      </div>
                      <div class="flex-grow">
                        <h4 class="text-gray-800 font-medium">{{ item.name }}</h4>
                        <div class="flex items-center mt-1">
                          <p class="text-gray-500 text-sm mr-2">{{ item.amount }}</p>
                          <p class="text-gray-500 text-sm flex items-center">
                            <FireIcon class="w-3 h-3 text-amber-500 mr-1" />
                            {{ item.calories }}卡路里
                          </p>
                        </div>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span 
                            v-for="tag in item.tags" 
                            :key="tag" 
                            :class="`${getTagClass(tag)} text-xs px-2 py-0.5 rounded-full`"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 没有记录时显示的内容 -->
                <div v-if="meals.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <div class="flex justify-center mb-4">
                    <PlusIcon class="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 class="text-gray-600 font-medium mb-2">没有膳食记录</h3>
                  <p class="text-gray-500 text-sm mb-4">点击"添加食物"按钮开始记录您的膳食</p>
                  <button 
                    class="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition flex items-center justify-center mx-auto"
                    @click="showAddFoodForm = true"
                  >
                    <PlusIcon class="w-4 h-4 mr-1" />
                    添加食物
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 饮食建议卡片 -->
            <div class="bg-white rounded-2xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">饮食建议</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  v-for="(suggestion, index) in dietSuggestions" 
                  :key="index"
                  class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition"
                >
                  <div :class="`bg-${suggestion.bgColor}-100 p-3 rounded-xl mb-3 w-12 h-12 flex items-center justify-center`">
                    <component :is="suggestion.icon" :class="`w-6 h-6 text-${suggestion.bgColor}-600`" />
                  </div>
                  <h3 class="font-medium text-gray-800 mb-2">{{ suggestion.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ suggestion.content }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧：营养摄入统计 -->
          <div>
            <!-- 卡路里卡片 -->
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-medium text-gray-800">今日卡路里摄入</h3>
                  <div class="mt-1 flex items-baseline">
                    <span class="text-2xl font-bold text-gray-800">{{ caloriesConsumed }}</span>
                    <span class="text-gray-500 ml-1">/ {{ caloriesGoal }} 卡路里</span>
                  </div>
                </div>
                <div class="bg-amber-100 p-2 rounded-lg">
                  <FireIcon class="w-5 h-5 text-amber-600" />
                </div>
              </div>
              
              <!-- 进度条 -->
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-amber-500 rounded-full" 
                  :style="`width: ${getPercentage(caloriesConsumed, caloriesGoal)}%`" 
                ></div>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                还可以摄入 {{ caloriesGoal - caloriesConsumed }} 卡路里
              </p>
            </div>
            
            <!-- 饮水卡片 -->
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-medium text-gray-800">今日饮水量</h3>
                  <div class="mt-1 flex items-baseline">
                    <span class="text-2xl font-bold text-gray-800">{{ waterConsumed }}</span>
                    <span class="text-gray-500 ml-1">/ {{ waterGoal }} 毫升</span>
                  </div>
                </div>
                <div class="bg-blue-100 p-2 rounded-lg">
                  <BeakerIcon class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <!-- 进度条 -->
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full" 
                  :style="`width: ${getPercentage(waterConsumed, waterGoal)}%`" 
                ></div>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                还需要饮水 {{ waterGoal - waterConsumed }} 毫升
              </p>
            </div>
            
            <!-- 营养素摄入 -->
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 class="font-medium text-gray-800 mb-4">营养素摄入</h3>
              <div class="space-y-4">
                <div v-for="nutrient in nutrients" :key="nutrient.name" class="mb-3">
                  <div class="flex justify-between mb-1 items-center">
                    <span class="text-gray-600 text-sm">{{ nutrient.name }}</span>
                    <span class="text-gray-800 text-sm font-medium">
                      {{ nutrient.consumed }}{{ nutrient.unit }} / {{ nutrient.goal }}{{ nutrient.unit }}
                    </span>
                  </div>
                  
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      :class="getNutrientBarColor(nutrient.name)"
                      class="h-full rounded-full" 
                      :style="`width: ${getPercentage(nutrient.consumed, nutrient.goal)}%`" 
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 膳食分布图表 -->
            <div class="bg-white rounded-2xl shadow-sm p-6">
              <h3 class="font-medium text-gray-800 mb-4">膳食分布</h3>
              
              <!-- 饼图占位符 -->
              <div class="flex justify-center items-center my-4">
                <div class="relative w-48 h-48">
                  <!-- 饼图实现 -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-40 h-40 rounded-full border-8 border-transparent flex items-center justify-center overflow-hidden">
                      <div class="absolute" style="width: 120%; height: 120%;">
                        <!-- 早餐部分 -->
                        <div class="absolute top-0 left-0 w-full h-full" style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%); background-color: #818cf8;"></div>
                        <!-- 午餐部分 -->
                        <div class="absolute top-0 left-0 w-full h-full" style="clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%); background-color: #f59e0b;"></div>
                        <!-- 晚餐部分 -->
                        <div class="absolute top-0 left-0 w-full h-full" style="clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%); background-color: #8b5cf6;"></div>
                        <!-- 加餐部分 -->
                        <div class="absolute top-0 left-0 w-full h-full" style="clip-path: polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%); background-color: #10b981;"></div>
                        
                        <!-- 中心圆 -->
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <FireIcon class="w-8 h-8 text-violet-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 图例 -->
              <div class="flex flex-wrap justify-center gap-4 mt-2">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-indigo-400 mr-2"></div>
                  <span class="text-sm text-gray-600">早餐</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span class="text-sm text-gray-600">午餐</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span class="text-sm text-gray-600">晚餐</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span class="text-sm text-gray-600">加餐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加食物弹窗 -->
      <div v-if="showAddFoodForm" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
          <!-- 弹窗标题 -->
          <div class="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">添加食物</h2>
            <button @click="showAddFoodForm = false" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          
          <!-- 弹窗内容 -->
          <div class="p-6">
            <form @submit.prevent="addFood">
              <!-- 膳食类型选择 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">膳食类型</label>
                <div class="grid grid-cols-4 gap-2">
                  <button 
                    type="button"
                    v-for="type in mealTypes" 
                    :key="type.name"
                    class="flex flex-col items-center justify-center py-2 px-2 border rounded-lg transition focus:outline-none"
                    :class="getMealTypeActiveClass(type.name)"
                    @click="newFood.mealType = type.name"
                  >
                    <component :is="type.icon" class="w-5 h-5 mb-1" />
                    <span class="text-xs">{{ type.name }}</span>
                  </button>
                </div>
              </div>
              
              <!-- 食物名称搜索 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">食物名称</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    v-model="newFood.name" 
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400" 
                    placeholder="搜索食物..."
                  />
                  
                  <!-- 搜索结果 -->
                  <div 
                    v-if="searchResults.length > 0 && newFood.name" 
                    class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100"
                  >
                    <div 
                      v-for="result in searchResults" 
                      :key="result.name" 
                      class="px-4 py-3 flex items-center hover:bg-gray-50 cursor-pointer"
                      @click="selectFood(result)"
                    >
                      <div class="w-10 h-10 rounded overflow-hidden mr-3">
                        <img :src="result.image" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-800">{{ result.name }}</div>
                        <div class="text-xs text-gray-500">{{ result.calories }} 卡路里 / {{ result.defaultAmount }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 卡路里 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">卡路里</label>
                <input 
                  type="number" 
                  v-model="newFood.calories" 
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500" 
                  placeholder="卡路里数量"
                />
              </div>
              
              <!-- 数量选择 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">数量</label>
                <div class="flex items-center">
                  <button 
                    type="button"
                    class="p-2 border border-gray-300 rounded-l-lg text-gray-600 hover:bg-gray-100" 
                    @click="decrementAmount"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    v-model="newFood.amount" 
                    class="block w-20 text-center py-2 border-t border-b border-gray-300 focus:ring-0 focus:border-gray-300" 
                  />
                  <button 
                    type="button"
                    class="p-2 border border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-100" 
                    @click="incrementAmount"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                  <select 
                    v-model="newFood.unit" 
                    class="ml-2 block px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="克">克</option>
                    <option value="毫升">毫升</option>
                    <option value="份">份</option>
                    <option value="个">个</option>
                  </select>
                </div>
              </div>
              
              <!-- 标签选择 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">营养标签</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    v-for="tag in availableTags" 
                    :key="tag.name"
                    class="px-3 py-1 rounded-full text-sm font-medium transition"
                    :class="newFood.tags.includes(tag.name) ? tag.activeClass : tag.inactiveClass"
                    @click="toggleTag(tag.name)"
                  >
                    {{ tag.name }}
                  </button>
                </div>
              </div>
              
              <!-- 时间选择 -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">用餐时间</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="time" 
                    v-model="newFood.time" 
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500" 
                  />
                </div>
              </div>
              
              <!-- 提交按钮 -->
              <div class="flex justify-end gap-2 mt-8">
                <button 
                  type="button" 
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium" 
                  @click="showAddFoodForm = false"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
                >
                  添加食物
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { 
    CalendarIcon, 
    PlusIcon, 
    XMarkIcon, 
    MinusIcon, 
    FireIcon, 
    BeakerIcon, 
    CakeIcon, 
    ClockIcon, 
    MagnifyingGlassIcon,
    SunIcon,
    MoonIcon,
    FunnelIcon,
    ChevronDownIcon
  } from '@heroicons/vue/24/outline';
  
  // 当前日期
  const currentDate = ref(new Date());
  
  // UI 状态控制
  const showAddFoodForm = ref(false);
  const showFilterMenu = ref(false);
  const activeFilter = ref('all');
  
  // 新食物表单
  const newFood = reactive({
    mealType: '早餐',
    name: '',
    calories: 0,
    amount: 100,
    unit: '克',
    tags: [],
    time: '08:00'
  });
  
  // 膳食类型
  const mealTypes = [
    { name: '早餐', icon: SunIcon, color: 'indigo' },
    { name: '午餐', icon: FireIcon, color: 'amber' },
    { name: '晚餐', icon: MoonIcon, color: 'purple' },
    { name: '加餐', icon: CakeIcon, color: 'green' }
  ];
  
  // 可用的营养素标签
  const availableTags = [
    { name: '高蛋白', activeClass: 'bg-indigo-100 text-indigo-700', inactiveClass: 'bg-gray-100 text-gray-600' },
    { name: '低脂', activeClass: 'bg-blue-100 text-blue-700', inactiveClass: 'bg-gray-100 text-gray-600' },
    { name: '低碳水', activeClass: 'bg-emerald-100 text-emerald-700', inactiveClass: 'bg-gray-100 text-gray-600' },
    { name: '高纤维', activeClass: 'bg-amber-100 text-amber-700', inactiveClass: 'bg-gray-100 text-gray-600' }
  ];
  
  // 搜索结果模拟
  const searchResults = computed(() => {
    if (!newFood.name) return [];
    
    // 模拟搜索返回结果
    return [
      { 
        name: '鸡胸肉', 
        calories: 165, 
        defaultAmount: '100克',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      { 
        name: '全麦面包', 
        calories: 265, 
        defaultAmount: '100克',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      { 
        name: '牛油果', 
        calories: 160, 
        defaultAmount: '100克',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ].filter(item => item.name.includes(newFood.name));
  });
  
  // 当日膳食记录
  const meals = ref([
    {
      type: '早餐',
      time: '08:30',
      calories: 650,
      items: [
        {
          name: '全麦面包',
          amount: '2片',
          calories: 200,
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高纤维', '低脂']
        },
        {
          name: '鸡蛋',
          amount: '2个',
          calories: 150,
          image: 'https://images.unsplash.com/photo-1607690424560-35d7c9a0db23?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高蛋白']
        },
        {
          name: '牛奶',
          amount: '300毫升',
          calories: 150,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高蛋白', '高钙']
        },
        {
          name: '香蕉',
          amount: '1个',
          calories: 150,
          image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高纤维']
        }
      ]
    },
    {
      type: '午餐',
      time: '12:30',
      calories: 850,
      items: [
        {
          name: '糙米饭',
          amount: '1碗',
          calories: 250,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高纤维', '低脂']
        },
        {
          name: '鸡胸肉',
          amount: '150克',
          calories: 300,
          image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高蛋白', '低脂']
        },
        {
          name: '西兰花',
          amount: '100克',
          calories: 100,
          image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高纤维', '低碳水']
        },
        {
          name: '混合沙拉',
          amount: '1份',
          calories: 200,
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          tags: ['高纤维', '低脂']
        }
      ]
    }
  ]);
  
  // 营养目标和摄入量
  const caloriesGoal = 2200;
  const caloriesConsumed = computed(() => {
    return meals.value.reduce((total, meal) => total + meal.calories, 0);
  });
  
  const waterGoal = 2000;
  const waterConsumed = ref(1200);
  
  // 营养素摄入
  const nutrients = [
    { name: '蛋白质', consumed: 85, goal: 120, unit: 'g', color: '#6366f1' },
    { name: '碳水化合物', consumed: 220, goal: 250, unit: 'g', color: '#f59e0b' },
    { name: '脂肪', consumed: 45, goal: 70, unit: 'g', color: '#10b981' }
  ];
  
  // 饮食建议
  const dietSuggestions = [
    { 
      icon: BeakerIcon, 
      title: '增加水分摄入', 
      content: '建议每日饮水量达到2000ml，有助于新陈代谢和皮肤健康。',
      bgColor: 'blue'
    },
    { 
      icon: FireIcon, 
      title: '控制碳水摄入', 
      content: '晚餐减少碳水化合物的摄入，可以帮助控制体重和改善睡眠质量。',
      bgColor: 'amber'
    },
    { 
      icon: SunIcon, 
      title: '早餐增加蛋白质', 
      content: '早餐适当增加蛋白质摄入，可以提供持久的饱腹感和稳定血糖。',
      bgColor: 'indigo'
    }
  ];
  
  // 格式化日期
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  };
  
  // 计算百分比
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    const percentage = (value / total) * 100;
    return Math.min(percentage, 100);
  };
  
  // 获取膳食图标背景色
  const getMealIconBg = (mealType) => {
    switch (mealType) {
      case '早餐': return 'bg-indigo-500';
      case '午餐': return 'bg-amber-500';
      case '晚餐': return 'bg-purple-500';
      case '加餐': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  // 获取膳食图标
  const getMealIcon = (mealType) => {
    switch (mealType) {
      case '早餐': return SunIcon;
      case '午餐': return FireIcon;
      case '晚餐': return MoonIcon;
      case '加餐': return CakeIcon;
      default: return CalendarIcon;
    }
  };
  
  // 获取标签样式
  const getTagClass = (tag) => {
    switch (tag) {
      case '高蛋白': return 'bg-indigo-100 text-indigo-600';
      case '低脂': return 'bg-blue-100 text-blue-600';
      case '低碳水': return 'bg-emerald-100 text-emerald-600';
      case '高纤维': return 'bg-amber-100 text-amber-600';
      case '高钙': return 'bg-violet-100 text-violet-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // 获取膳食类型激活类
  const getMealTypeActiveClass = (type) => {
    const colorMap = {
      '早餐': 'indigo',
      '午餐': 'amber',
      '晚餐': 'purple',
      '加餐': 'green'
    };
    
    const color = colorMap[type] || 'indigo';
    
    return newFood.mealType === type 
      ? `bg-${color}-100 border-${color}-500 text-${color}-700` 
      : 'border-gray-200 text-gray-600 hover:bg-gray-50';
  };

  // 获取营养素条形颜色
  const getNutrientBarColor = (name) => {
    switch (name) {
      case '蛋白质': return 'bg-indigo-500';
      case '碳水化合物': return 'bg-amber-500';
      case '脂肪': return 'bg-emerald-500';
      default: return 'bg-gray-200';
    }
  };
  
  // 增加食物数量
  const incrementAmount = () => {
    newFood.amount += 50;
  };
  
  // 减少食物数量
  const decrementAmount = () => {
    if (newFood.amount > 50) {
      newFood.amount -= 50;
    } else {
      newFood.amount = 0;
    }
  };
  
  // 切换标签
  const toggleTag = (tag) => {
    if (newFood.tags.includes(tag)) {
      newFood.tags = newFood.tags.filter(t => t !== tag);
    } else {
      newFood.tags.push(tag);
    }
  };
  
  // 选择食物
  const selectFood = (food) => {
    newFood.name = food.name;
    newFood.calories = food.calories;
    // 解析默认数量
    const match = food.defaultAmount.match(/(\d+)(\D+)/);
    if (match) {
      newFood.amount = parseInt(match[1]);
      newFood.unit = match[2];
    }
  };
  
  // 添加食物
  const addFood = () => {
    // 查找对应膳食
    let meal = meals.value.find(m => m.type === newFood.mealType);
    
    // 如果不存在该膳食，则创建一个新的
    if (!meal) {
      meal = {
        type: newFood.mealType,
        time: newFood.time,
        calories: 0,
        items: []
      };
      meals.value.push(meal);
    }
    
    // 添加食物到膳食中
    const newFoodItem = {
      name: newFood.name,
      amount: `${newFood.amount}${newFood.unit}`,
      calories: newFood.calories,
      image: searchResults.value.find(r => r.name === newFood.name)?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      tags: newFood.tags
    };
    
    meal.items.push(newFoodItem);
    
    // 更新膳食总热量
    meal.calories = meal.items.reduce((total, item) => total + item.calories, 0);
    
    // 重置表单
    newFood.name = '';
    newFood.calories = 0;
    newFood.amount = 100;
    newFood.unit = '克';
    newFood.tags = [];
    
    // 关闭表单
    showAddFoodForm.value = false;
  };
  
  // 获取样式变量
  const styleVars = {
    gradientStart: '#f5f3ff',
    gradientEnd: '#ede9fe',
    borderRadius: '0.75rem'
  };
</script>

<style scoped>
.glass {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 确保表单的滚动区域有美观的滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.5);
}
</style>