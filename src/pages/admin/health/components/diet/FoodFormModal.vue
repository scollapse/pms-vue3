<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
    </Transition>

    <!-- 居中内容定位 -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <!-- 表单内容 -->
      <Transition name="slide-up">
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- 表单标题 -->
          <div class="bg-gradient-to-r from-violet-100 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ editMode ? '编辑食物' : '添加新食物' }}
              </h3>
              <button @click="$emit('close')" 
                class="rounded-full p-1.5 hover:bg-white/50 text-gray-500 hover:text-gray-800 transition-colors">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 表单内容 -->
          <div class="px-6 py-5">
            <div class="space-y-5">
              <!-- 食物名称 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">食物名称</label>
                <input 
                  v-model="newFood.name" 
                  type="text" 
                  placeholder="输入食物名称" 
                  class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                />
              </div>

              <!-- 食物图片 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">食物图片</label>
                <div class="flex items-center space-x-4">
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img v-if="newFood.image" :src="newFood.image" class="w-full h-full object-cover" alt="食物图片" />
                    <PhotoIcon v-else class="w-10 h-10 text-gray-300" />
                  </div>
                  <div class="flex-1">
                    <input 
                      v-model="newFood.image" 
                      type="text" 
                      placeholder="输入图片URL" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors mb-2"
                    />
                    <p class="text-xs text-gray-500">支持网络图片URL链接</p>
                  </div>
                </div>
              </div>

              <!-- 膳食类型与食物数量 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">膳食类型</label>
                  <select 
                    v-model="newFood.mealType" 
                    class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors bg-white"
                  >
                    <option v-for="type in mealTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">食物数量</label>
                  <input 
                    v-model="newFood.amount" 
                    type="text" 
                    placeholder="例如：2片、100克" 
                    class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <!-- 营养成分 -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-medium text-gray-800 mb-3">营养成分</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1.5">卡路里</label>
                    <input 
                      v-model="newFood.calories" 
                      type="number" 
                      placeholder="卡路里" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1.5">蛋白质 (g)</label>
                    <input 
                      v-model="newFood.protein" 
                      type="number" 
                      placeholder="蛋白质" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1.5">碳水 (g)</label>
                    <input 
                      v-model="newFood.carbs" 
                      type="number" 
                      placeholder="碳水" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1.5">脂肪 (g)</label>
                    <input 
                      v-model="newFood.fat" 
                      type="number" 
                      placeholder="脂肪" 
                      class="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <!-- 标签选择 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">食物标签</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="tag in availableTags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    :class="[
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      newFood.tags.includes(tag)
                        ? `${getTagClass(tag)} shadow-sm`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 表单按钮 -->
          <div class="flex px-6 py-4 bg-gray-50 rounded-b-2xl">
            <button @click="$emit('close')"
                    class="flex-1 mr-2 bg-white text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
              取消
            </button>
            <button @click="$emit('save', newFood)" 
                    :disabled="!isFormValid"
                    :class="isFormValid ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'"
                    class="flex-1 ml-2 text-white py-2.5 px-4 rounded-lg transition-all font-medium">
              保存
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import useFoodForm from '../composables/useFoodForm'
import useDietUtils from '../composables/useDietUtils'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialFood: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

const { newFood, isFormValid, mealTypes, availableTags, toggleTag } = useFoodForm()
const { getTagClass } = useDietUtils()

// 如果处于编辑模式，则设置表单初始值
if (props.editMode && props.initialFood) {
  Object.keys(props.initialFood).forEach(key => {
    if (key === 'tags') {
      newFood.value.tags = [...props.initialFood.tags]
    } else {
      newFood.value[key] = props.initialFood[key]
    }
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style> 