import { ref, computed } from 'vue'

export default function useDietData() {
  // 饮食数据
  const meals = ref([
    {
      type: '早餐',
      time: '07:30',
      calories: 450,
      items: [
        {
          name: '全麦面包',
          amount: '2片',
          calories: 160,
          image: '/images/food/bread.jpg',
          protein: 8,
          carbs: 26,
          fat: 2,
          tags: ['碳水', '全麦']
        },
        {
          name: '煮鸡蛋',
          amount: '2个',
          calories: 140,
          image: '/images/food/eggs.jpg',
          protein: 12,
          carbs: 0,
          fat: 10,
          tags: ['蛋白质', '低碳水']
        },
        {
          name: '牛奶',
          amount: '240ml',
          calories: 150,
          image: '/images/food/milk.jpg',
          protein: 8,
          carbs: 12,
          fat: 8,
          tags: ['蛋白质', '钙质']
        }
      ]
    },
    {
      type: '午餐',
      time: '12:30',
      calories: 650,
      items: [
        {
          name: '意大利面',
          amount: '1份',
          calories: 320,
          image: '/images/food/pasta.jpg',
          protein: 12,
          carbs: 60,
          fat: 6,
          tags: ['碳水', '主食']
        },
        {
          name: '鸡胸肉',
          amount: '100g',
          calories: 165,
          image: '/images/food/chicken.jpg',
          protein: 31,
          carbs: 0,
          fat: 3.6,
          tags: ['蛋白质', '瘦肉']
        },
        {
          name: '蔬菜沙拉',
          amount: '1份',
          calories: 165,
          image: '/images/food/salad.jpg',
          protein: 2,
          carbs: 10,
          fat: 15,
          tags: ['维生素', '纤维素']
        }
      ]
    },
    {
      type: '晚餐',
      time: '18:30',
      calories: 550,
      items: [
        {
          name: '糙米饭',
          amount: '1碗',
          calories: 220,
          image: '/images/food/rice.jpg',
          protein: 5,
          carbs: 45,
          fat: 2,
          tags: ['碳水', '全谷物']
        },
        {
          name: '红烧鱼',
          amount: '1条',
          calories: 200,
          image: '/images/food/fish.jpg',
          protein: 28,
          carbs: 0,
          fat: 10,
          tags: ['蛋白质', '高脂鱼']
        },
        {
          name: '清炒西兰花',
          amount: '1份',
          calories: 130,
          image: '/images/food/broccoli.jpg',
          protein: 4,
          carbs: 10,
          fat: 8,
          tags: ['纤维素', '低热量']
        }
      ]
    },
    {
      type: '加餐',
      time: '15:30',
      calories: 200,
      items: [
        {
          name: '希腊酸奶',
          amount: '1杯',
          calories: 100,
          image: '/images/food/yogurt.jpg',
          protein: 10,
          carbs: 5,
          fat: 5,
          tags: ['蛋白质', '益生菌']
        },
        {
          name: '蓝莓',
          amount: '100g',
          calories: 100,
          image: '/images/food/blueberries.jpg',
          protein: 1,
          carbs: 20,
          fat: 0,
          tags: ['水果', '抗氧化']
        }
      ]
    }
  ])

  // 营养摄入摘要
  const nutritionSummary = ref({
    calories: {
      consumed: 1850,
      goal: 2200,
      unit: '卡路里'
    },
    protein: {
      consumed: 120,
      goal: 150,
      unit: 'g'
    },
    carbs: {
      consumed: 170,
      goal: 220,
      unit: 'g'
    },
    fat: {
      consumed: 65,
      goal: 70,
      unit: 'g'
    }
  })

  // 水分摄入
  const waterIntake = ref({
    consumed: 1200,
    goal: 2500,
    unit: 'ml'
  })

  // 常用食物
  const frequentFoods = ref([
    {
      name: '鸡胸肉',
      calories: 165,
      image: '/images/food/chicken.jpg',
      frequency: 5
    },
    {
      name: '燕麦片',
      calories: 150,
      image: '/images/food/oatmeal.jpg',
      frequency: 4
    },
    {
      name: '全麦面包',
      calories: 80,
      image: '/images/food/bread.jpg',
      frequency: 4
    },
    {
      name: '希腊酸奶',
      calories: 100,
      image: '/images/food/yogurt.jpg',
      frequency: 3
    }
  ])

  // 食物筛选
  const activeFilter = ref('all')
  
  // 计算属性
  const filteredMeals = computed(() => {
    if (activeFilter.value === 'all') {
      return meals.value
    }
    
    return meals.value.map(meal => {
      const filteredItems = meal.items.filter(item => {
        if (activeFilter.value === 'protein') {
          return item.tags.includes('蛋白质')
        } else if (activeFilter.value === 'lowCarb') {
          return item.tags.includes('低碳水')
        }
        return true
      })
      
      return {
        ...meal,
        items: filteredItems,
        calories: filteredItems.reduce((sum, item) => sum + item.calories, 0)
      }
    }).filter(meal => meal.items.length > 0)
  })

  return {
    meals,
    filteredMeals,
    nutritionSummary,
    waterIntake,
    frequentFoods,
    activeFilter
  }
} 