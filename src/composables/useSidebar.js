import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/stores/menu';
import { useTabStore } from '@/stores/tab';

export function useSidebar() {
  const menuStore = useMenuStore();
  const tabStore = useTabStore();
  const collapsed = computed(() => menuStore.isSidebarCollapsed);
  const activeMenu = computed(() => menuStore.activeMenu);
  const router = useRouter();
  const route = useRoute();

  const menuItems = ref([
    { name: '看板', link: '/admin/index', icon: 'fas fa-tachometer-alt' },
    { name: '标签管理', link: '/admin/tag/list', icon: 'fas fa-tags' },
    { name: '项目管理', link: '/admin/project/index', icon: 'fas fa-project-diagram' },
    { name: '任务管理', link: '/admin/task/index', icon: 'fas fa-tasks' }
  ]);

  watch(
    () => activeMenu.value,
    (newActiveMenu) => {
      menuItems.value.forEach(item => {
        item.selected = item.link === newActiveMenu;
      });
    },
    { immediate: true }
  );

  const navigateTo = (link) => {
    const selectedItem = menuItems.value.find(item => item.link === link);
    if (selectedItem) {
      tabStore.addTab({ title: selectedItem.name, path: selectedItem.link });
      tabStore.setActiveTab(selectedItem.link);
      menuStore.setActiveMenu(selectedItem.link);
    }
    router.push(link);
  };

  return {
    collapsed,
    activeMenu,
    menuItems,
    navigateTo,
  };
}
