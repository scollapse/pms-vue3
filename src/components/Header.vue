<template>
    <header class="bg-purple-100 text-gray-800 flex justify-between items-center px-6 py-4 shadow-md">
        <!-- 左侧折叠按钮 -->
        <button class="text-gray-800 focus:outline-none hover:text-purple-300" @click="toggleSidebar">
            <svg v-if="!isSidebarCollapsed" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 12L6 6v12z" />
            </svg>
        </button>

        <!-- 中间标题 -->
        <h1 class="text-xl font-bold tracking-wide font-cursive">
            Rabbit PMS
        </h1>

        <!-- 右侧用户菜单 -->
        <div class="relative flex items-center" ref="dropdown">
            <button class="text-gray-800 focus:outline-none hover:text-purple-300 mr-4" @click="toggle">
                <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zm6 10v6h-6v-2h4v-4h2v6zm-10 6H4v-6h2v4h4v2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18h-6v-2h4v-4h2v6zm-10 0H4v-6h2v4h4v2z" />
                </svg>
            </button>
            <button class="focus:outline-none flex items-center space-x-2 hover:bg-purple-200 px-3 py-1 rounded-xl"
                @click="toggleDropdown">
                <img class="w-8 h-8 rounded-full border-2 border-purple-300" src="https://via.placeholder.com/150"
                    alt="User Avatar" />
                <span class="hidden md:inline">{{ userInfo.value.username }}</span>
            </button>
            <!-- 用户菜单下拉框 -->
            <transition name="fade">
                <ul v-if="isDropdownOpen"
                    class="absolute right-0 mt-44 w-28 bg-purple-50 text-gray-800 rounded-xl shadow-lg z-10">
                    <li>
                        <button class="w-full text-left block px-4 py-2 rounded-xl hover:bg-purple-100" @click="modifyUserInfo">修改密码</button>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-purple-100">系统设置</a>
                    </li>
                    <li>
                        <button class="w-full text-left block px-4 py-2 rounded-xl hover:bg-purple-100" @click="confirmLogout">账号登出</button>
                    </li>
                </ul>
            </transition>
        </div>
    </header>
    <ModifyUserModal ref="modifyUserModal" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useHeader } from '@/composables/useHeader';
import ModifyUserModal from '@/pages/admin/modify-user.vue';

const modifyUserModal = ref(null);
const { userInfo, setUserInfo, isFullscreen, toggle, isSidebarCollapsed, toggleSidebar, isDropdownOpen, dropdown, toggleDropdown, confirmLogout, modifyUserInfo } = useHeader(modifyUserModal);

onMounted(() => {
    if (!userInfo.value.username) {
        setUserInfo();
    }
});
</script>

<style scoped>
/* 添加必要的样式以优化布局 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>