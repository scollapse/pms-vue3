<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <!-- 标题 -->
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900">
                    修改密码
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:bg-gray-200 rounded-xl text-sm p-1.5 ml-auto inline-flex items-center">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <!-- 表单 -->
            <form @submit.prevent="submitForm">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">邮箱</label>
                    <input type="email" id="email" v-model="form.username" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" disabled>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                            <svg v-if="showPassword" class="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274 1.057-.742 2.057-1.374 2.958M15 12a3 3 0 01-6 0M2.458 12C3.732 16.057 7.523 19 12 19c4.477 0 8.268-2.943 9.542-7-.274-1.057-.742-2.057-1.374-2.958" />
                            </svg>
                            <svg v-else class="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .274-1.057.742-2.057 1.374-2.958M15 12a3 3 0 01-6 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274-1.057-.742-2.057-1.374-2.958" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="errors.password" class="text-pink-500  text-sm mt-2">{{ errors.password }}</p>
                </div>
                <div class="mb-4">
                    <label for="confirm_password" class="block text-sm font-medium text-gray-700">确认密码</label>
                    <div class="relative">
                        <input :type="showConfirmPassword ? 'text' : 'password'" id="confirm_password" v-model="form.confirm_password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <button type="button" @click="toggleConfirmPasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                            <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274 1.057-.742-2.057-1.374-2.958M15 12a3 3 0 01-6 0M2.458 12C3.732 16.057 7.523 19 12 19c4.477 0 8.268-2.943 9.542-7-.274-1.057-.742-2.057-1.374-2.958" />
                            </svg>
                            <svg v-else class="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .274-1.057.742-2.057 1.374-2.958M15 12a3 3 0 01-6 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274-1.057-.742-2.057-1.374-2.958" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="errors.confirm_password" class="text-pink-500  text-sm mt-2">{{ errors.confirm_password }}</p>
                </div>
                <!-- 操作按钮 -->
                <div class="mt-10 flex justify-end space-x-2">
                    <button type="submit" class="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-xl text-sm px-5 py-2.5">
                        确定
                    </button>
                    <button type="button" @click="closeModal" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-xl border border-gray-300 text-sm px-5 py-2.5">
                        取消
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { useModifyUser } from '@/composables/admin/useModifyUser';

export default {
    setup() {
        const { visible, errors, form, showPassword, showConfirmPassword, openModal, closeModal, submitForm, togglePasswordVisibility, toggleConfirmPasswordVisibility } = useModifyUser();

        return {
            visible,
            errors,
            form,
            showPassword,
            showConfirmPassword,
            openModal,
            closeModal,
            submitForm,
            togglePasswordVisibility,
            toggleConfirmPasswordVisibility
        };
    }
};
</script>

<style scoped>
/* 可添加自定义样式 */
</style>
