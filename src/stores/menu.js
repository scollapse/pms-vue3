import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        isSidebarCollapsed: false,
        activeMenu: '/admin/index', // 默认激活的菜单项
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        setActiveMenu(menuPath) {
            this.activeMenu = menuPath;
        }
    },
});
