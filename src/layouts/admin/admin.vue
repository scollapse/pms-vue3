<template>
    <div class="flex h-screen bg-purple-100">
        <!-- 左侧侧边栏 -->
        <aside :class="[
            'transition-all duration-300 ease-in-out rounded-3lg', // Added rounded-lg for rounded corners
            isSidebarCollapsed ? 'w-16' : 'w-64'
        ]">
            <Sidebar :collapsed="isSidebarCollapsed" />
        </aside>

        <!-- 主内容区域 -->
        <div class="flex flex-col flex-grow">
            <!-- 顶部导航栏 -->
            <Header  />

            <!-- TabList -->
            <TabList />

            <!-- 主体内容 -->
            <main :class="[
                'flex-grow p-6  overflow-y-auto bg-purple-100'
            ]">
                <router-view v-slot="{ Component }">
                    <Transition name="fade" mode="out-in">
                        <!-- 指定最多缓存 10 个组件 -->
                        <KeepAlive :max="10">
                            <component :is="Component" />
                        </KeepAlive>
                    </Transition>
                </router-view>
            </main>

            <!-- 底部页脚 -->
            <Footer />
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import TabList from '@/components/TabList.vue';
import { useAdminLayout } from '@/composables/useAdminLayout';

const { isSidebarCollapsed, activeTab } = useAdminLayout();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>