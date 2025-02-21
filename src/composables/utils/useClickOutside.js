import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useClickOutside() {
  const isDropdownOpen = ref(false);
  const dropdown = ref(null);

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return {
    isDropdownOpen,
    dropdown,
    toggleDropdown,
  };
}
