import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', {
    state: () => ({
        tabs: [
            { title: '仪表盘', path: '/admin/index' },
            { title: '标签管理', path: '/admin/tag/list' },
            { title: '项目管理', path: '/admin/project/index' }
        ],
        activeTab: '/admin/index', // 默认激活的 Tab path
    }),
    actions: {
        setActiveTab(tabPath) {
            this.activeTab = tabPath;

        },
        addTab(tab) {
            if (!this.tabs.find(t => t.path === tab.path)) {
                this.tabs.push(tab);

            }
        },
        removeTab(path) {
            this.tabs = this.tabs.filter(tab => tab.path !== path);

        }
    },
    persist: true // 开启持久化
});
