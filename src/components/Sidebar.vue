<template>
    <aside :class="[
        'bg-white text-gray-800 h-screen shadow-md transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
    ]">
        <div :class="['text-lg font-bold flex items-center justify-center',
            { 'p-4': collapsed },
            { 'p-10 ': !collapsed }
        ]">
            <a href="/" class="text-gray-800 text-center flex items-center">
                <img v-if="!collapsed" src="@/assets/logo.png" alt="Logo" class="h-16 mr-2">
                <img v-if="collapsed" src="@/assets/logo.png" alt="Logo" class="h-8 mr-2">
                <span v-if="!collapsed">Rabbit PMS</span>
            </a>
        </div>
        <nav class="bg-purple-100 ">
            <ul>
                <li v-for="(item, index) in menuItems" :key="item.name" :class="[
                    ' bg-white',
                    {
                        'rounded-tr-[40px]': index > 0 && menuItems[index - 1].selected,
                        'rounded-br-[40px]': index < menuItems.length - 1 && menuItems[index + 1].selected
                    },
                    { 'pl-7': !collapsed }
                ]">
                    <a @click="navigateTo(item.link)" :class="[
                        'hover:bg-purple-100 last:border-0 hover:rounded-l-[40px] block px-12 py-5 transition flex items-center',
                        {
                            'bg-purple-100 text-gray-800 rounded-l-[40px]': item.selected
                        }
                    ]">
                        <i :class="item.icon" class="mr-3 text-lg"></i>
                        <span v-if="!collapsed">{{ item.name }}</span>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { useSidebar } from '@/composables/useSidebar';

const { collapsed, menuItems, navigateTo } = useSidebar();
</script>

<style scoped>
/* 添加必要的样式以优化布局 */
</style>
