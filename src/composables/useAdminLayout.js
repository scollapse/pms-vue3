import { computed, watch } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useTabStore } from '@/stores/tab';

export function useAdminLayout() {
  const menuStore = useMenuStore();
  const tabStore = useTabStore();

  // 侧边栏折叠状态
  const isSidebarCollapsed = computed(() => menuStore.isSidebarCollapsed);

  // 监听激活的 Tab 变化
  const activeTab = computed(() => tabStore.activeTab);

  // 打印激活的 Tab ID（可用作调试或导航控制）
  watch(
    () => activeTab.value,
    (newTab) => {
      console.log('Active Tab Changed:', newTab);
    }
  );

  return {
    isSidebarCollapsed,
    activeTab,
  };
}
