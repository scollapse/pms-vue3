<template>
    <div class="relative">
        <!-- 输入框和标签容器 -->
        <div 
            class="flex flex-wrap items-center gap-2"
            :class="{'border-gray-300': !isFocused, 'border-purple-500': isFocused}"
            @click="handleContainerClick"
        >
            <div class="relative flex-1">
                <div class="flex flex-wrap items-center gap-2 absolute left-0 top-1/2 transform -translate-y-1/2 pl-2" ref="tagsContainer">
                    <!-- 已选标签 -->
                    <el-tag
                        v-for="tag in modelValue"
                        :key="tag.id"
                        closable
                        class="!m-1"
                        @close="removeTag(tag)"
                    >
                        {{ tag.name }}
                    </el-tag>
                </div>
                <!-- 输入框 -->
                <input
                    ref="inputRef"
                    v-model="inputValue"
                    type="text"
                    class="form-input w-full pl-2"
                    :style="{ paddingLeft: `${tagsContainerWidth}px` }"
                    :placeholder="modelValue.length ? '' : '请输入标签并按回车键确认'"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keydown.enter.prevent="handleEnter"
                >

                <!-- 清空按钮 -->
                <div 
                    v-if="modelValue.length"
                    class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2"
                    @click.stop="clearTags"
                >
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- 标签下拉列表 -->
        <div 
            v-show="showDropdown && filteredTags.length"
            class="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto"
        >
            <div class="p-2 flex flex-wrap gap-2">
                <el-tag
                    v-for="tag in filteredTags"
                    :key="tag.id"
                    class="cursor-pointer !m-1"
                    :class="{'opacity-50': modelValue.some(t => t.id === tag.id)}"
                    @click="selectTag(tag)"
                >
                    {{ tag.name }}
                </el-tag>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { fetchTags } from '@/api/admin/tag'
import toast from '@/composables/utils/toast'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    maxTags: {
        type: Number,
        default: 5
    }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const inputValue = ref('')
const isFocused = ref(false)
const showDropdown = ref(false)
const availableTags = ref([])

// 过滤后的标签列表
const filteredTags = computed(() => {
    const searchText = inputValue.value.toLowerCase()
    return availableTags.value.filter(tag => 
        tag.name.toLowerCase().includes(searchText) && 
        !props.modelValue.some(t => t.id === tag.id)
    )
})

// 加载标签列表
const loadTags = async () => {
    try {
        const res = await fetchTags({
            current: 1,
            size: 999
        })
        if (res.success) {
            availableTags.value = res.data
        }
    } catch (error) {
        console.error('Failed to load tags:', error)
    }
}

// 处理输入框点击
const handleContainerClick = () => {
    inputRef.value?.focus()
}

// 处理输入框焦点
const handleFocus = () => {
    isFocused.value = true
    showDropdown.value = true
}

const handleBlur = () => {
    setTimeout(() => {
        isFocused.value = false
        showDropdown.value = false
    }, 200)
}

// 处理回车键
const handleEnter = () => {
    const tagName = inputValue.value.trim()
    if (tagName) {
        if (props.modelValue.length >= props.maxTags) {
            toast.error(`标签数量已达到上限 ${props.maxTags} 个`)
            inputValue.value = ''
            return
        }
        // 检查是否已存在相同名称的标签
        const existingTag = availableTags.value.find(t => t.name.toLowerCase() === tagName.toLowerCase())
        if (existingTag) {
            if (!props.modelValue.some(t => t.id === existingTag.id)) {
                emit('update:modelValue', [...props.modelValue, existingTag])
            }
        } else {
            // 如果是新标签，创建一个临时对象
            const newTag = {
                name: tagName,
            }
            emit('update:modelValue', [...props.modelValue, newTag])
        }
    }
    inputValue.value = ''
}

// 选择标签
const selectTag = (tag) => {
    if (props.modelValue.length >= props.maxTags) {
        toast.error(`标签数量已达到上限 ${props.maxTags} 个`)
        return
    }
    if (!props.modelValue.some(t => t.id === tag.id)) {
        emit('update:modelValue', [...props.modelValue, tag])
    }
}

// 移除标签
const removeTag = (tag) => {
    emit('update:modelValue', props.modelValue.filter(t => t.id !== tag.id))
}

// 清空标签
const clearTags = () => {
    emit('update:modelValue', [])
}

// 初始化加载标签列表
loadTags()

const tagsContainer = ref(null)
const tagsContainerWidth = ref(0)

// 监听标签列表变化
watch(() => props.modelValue, async () => {
    await nextTick()
    if (tagsContainer.value) {
        tagsContainerWidth.value = tagsContainer.value.offsetWidth + 8 // 加8px作为缓冲
    }
}, { immediate: true })
</script>