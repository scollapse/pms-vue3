import { computed } from 'vue';
import { useClickOutside } from '@/composables/utils/useClickOutside';
import { useMenuStore } from '@/stores/menu';
import { useFullscreen } from '@vueuse/core';
import { useUserStore } from '@/stores/user';
import modal from '@/composables/utils/modal';
import toast from '@/composables/utils/toast';
import router from '@/router/index';

export function useHeader(modifyUserModal) {
    const { isFullscreen, toggle } = useFullscreen();
    const menuStore = useMenuStore();
    const isSidebarCollapsed = computed(() => menuStore.isSidebarCollapsed);
    const toggleSidebar = () => {
        menuStore.toggleSidebar();
    };
    const { isDropdownOpen, dropdown, toggleDropdown } = useClickOutside();
    const { userInfo, setUserInfo, logout } = useUserStore();

    const confirmLogout = () => {
        modal.showConfirm('确定要登出吗？', () => {
            logout();
            toast.show('success', '登出成功!');
            // 跳转登录页
            router.push('/login');
        });
    };

    const modifyUserInfo = () => {
        if (modifyUserModal.value && typeof modifyUserModal.value.openModal === 'function') {
            modifyUserModal.value.openModal(userInfo.value.username);
        } else {
            console.error('modifyUserModal is not properly initialized');
        }
    };

    return {
        userInfo,
        setUserInfo,
        isFullscreen,
        toggle,
        isSidebarCollapsed,
        toggleSidebar,
        isDropdownOpen,
        dropdown,
        toggleDropdown,
        confirmLogout,
        modifyUserInfo,
    };
}
