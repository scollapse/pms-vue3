import { ref, computed } from 'vue'

export default function useFoodForm() {
  // 表单数据
  const newFood = ref({
    name: '',
    amount: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    image: '',
    tags: [],
    mealType: '早餐'
  })
  
  // 表单验证
  const isFormValid = computed(() => {
    return newFood.value.name.trim() !== '' && 
           newFood.value.amount.trim() !== '' && 
           newFood.value.calories.trim() !== '' &&
           newFood.value.mealType !== ''
  })
  
  // 可选的膳食类型
  const mealTypes = ['早餐', '午餐', '晚餐', '加餐']
  
  // 可选的标签
  const availableTags = [
    '蛋白质',
    '碳水',
    '低碳水',
    '全麦',
    '瘦肉',
    '水果',
    '纤维素',
    '维生素',
    '益生菌',
    '抗氧化',
    '钙质',
    '低热量'
  ]
  
  // 重置表单
  const resetForm = () => {
    newFood.value = {
      name: '',
      amount: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      image: '',
      tags: [],
      mealType: '早餐'
    }
  }
  
  // 切换标签
  const toggleTag = (tag) => {
    const index = newFood.value.tags.indexOf(tag)
    if (index === -1) {
      newFood.value.tags.push(tag)
    } else {
      newFood.value.tags.splice(index, 1)
    }
  }

  return {
    newFood,
    isFormValid,
    mealTypes,
    availableTags,
    resetForm,
    toggleTag
  }
} 