import { ref, watch } from 'vue';
import { useTabStore } from '@/stores/tab';
import { useRoute, useRouter } from 'vue-router';
import { useClickOutside } from '@/composables/utils/useClickOutside';
import { useMenuStore } from '@/stores/menu';

export function useTabList() {
  const tabStore = useTabStore();

  const route = useRoute();
  const router = useRouter();
  const menuStore = useMenuStore();
  const { isDropdownOpen, dropdown, toggleDropdown } = useClickOutside();

  const changeTab = (path) => {
    tabStore.setActiveTab(path);
    menuStore.setActiveMenu(path);
    router.push(path);
  };

  const closeTab = (path) => {
    const tabIndex = tabStore.tabs.findIndex(tab => tab.path === path);
    tabStore.removeTab(path);

    if (tabStore.activeTab === path) {
      if (tabStore.tabs.length > 0) {
        const newActiveTab = tabStore.tabs[tabIndex] || tabStore.tabs[tabIndex - 1];
        changeTab(newActiveTab.path);
      } else {
        changeTab('/admin/index');
      }
    }
  };

  const closeOtherTabs = () => {
    tabStore.tabs = tabStore.tabs.filter(tab => tab.path === '/admin/index' || tab.path === tabStore.activeTab);
    tabStore.saveTabs();
    isDropdownOpen.value = false;
  };

  const closeAllTabs = () => {
    tabStore.tabs = tabStore.tabs.filter(tab => tab.path === '/admin/index');
    changeTab('/admin/index');
    isDropdownOpen.value = false;
  };

  watch(
    () => route.path,
    (newPath) => {
      tabStore.setActiveTab(newPath);
      menuStore.setActiveMenu(newPath);
    },
    { immediate: true }
  );

  return {
    tabStore,
    isDropdownOpen,
    dropdown,
    toggleDropdown,
    changeTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
  };
}
