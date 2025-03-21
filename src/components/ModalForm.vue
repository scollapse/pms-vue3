<template>
    <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div :class="['bg-white rounded-xl shadow-lg p-6', sizeClass]">
            <!-- 标题 -->
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900">
                    {{ title }}
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:bg-gray-200 rounded-xl text-sm p-1.5 ml-auto inline-flex items-center">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <!-- 表单插槽 -->
            <div class="modal-body">
                <slot></slot>
            </div>
            <!-- 操作按钮 -->
            <div class="mt-10 flex justify-end space-x-2">
                <button 
                    @click="confirm" 
                    :disabled="loading" 
                    class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 flex items-center justify-center"
                >
                    <span v-if="!loading">{{ confirmText }}</span>
                    <span v-else class="flex items-center">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="ml-2">提交中...</span>
                    </span>
                </button>
                <button @click="closeModal" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-xl border border-gray-300 text-sm px-5 py-2.5">
                    取消
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    },
    confirmText: {
        type: String,
        default: '确定'
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

const closeModal = () => {
    emit('update:modelValue', false);
    emit('close');
};

const confirm = () => {
    emit('confirm');
};

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'max-w-md';
        case 'md': return 'max-w-2xl';
        case 'lg': return 'max-w-4xl';
        case 'xl': return 'max-w-6xl';
        case 'full': return 'w-full max-w-[90%] h-[90vh]';
        default: return 'max-w-2xl';
    }
});
</script>

<style scoped>
.modal-body {
    max-height: calc(90vh - 180px);
    overflow-y: auto;
}
</style>