<template>
  <div class="icon-picker">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        class="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      >
        <span class="flex items-center">
          <span v-if="modelValue" class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mr-2">
            <component :is="getIconComponent(modelValue)" class="h-5 w-5 text-purple-600" aria-hidden="true" />
          </span>
          <span v-else class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </span>
          <span class="block truncate">{{ selectedIconName || '选择图标' }}</span>
        </span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>

      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        style="max-height: 300px;"
      >
        <div class="grid grid-cols-6 gap-2 p-2">
          <button
            v-for="icon in icons"
            :key="icon.name"
            type="button"
            @click="selectIcon(icon.name)"
            class="inline-flex items-center justify-center p-2 rounded-md hover:bg-purple-100 focus:outline-none"
            :class="{ 'bg-purple-100': modelValue === icon.name }"
          >
            <component :is="icon.component" class="h-6 w-6" :class="modelValue === icon.name ? 'text-purple-600' : 'text-gray-500'" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  AcademicCapIcon, BellIcon, BookOpenIcon, CalendarIcon, ChatIcon, CheckCircleIcon,
  ChipIcon, ClockIcon, CodeIcon, CogIcon, CollectionIcon, CubeIcon,
  DatabaseIcon, DesktopComputerIcon, DeviceMobileIcon, DocumentIcon, DocumentTextIcon, FireIcon,
  GlobeIcon, HeartIcon, HomeIcon, LightBulbIcon, MailIcon, MoonIcon,
  MusicNoteIcon, PaperClipIcon, PencilIcon, PhotographIcon, PuzzleIcon, ShieldCheckIcon,
  ShoppingBagIcon, StarIcon, SunIcon, TagIcon, TruckIcon, UserIcon,
  VideoCameraIcon, ViewGridIcon, WifiIcon, CakeIcon, CurrencyDollarIcon, BeakerIcon,
  CashIcon, ChartBarIcon, ChartPieIcon, ChartSquareBarIcon, CloudIcon, ColorSwatchIcon,
  CreditCardIcon, CubeTransparentIcon, EmojiHappyIcon, EyeIcon, FilmIcon, FolderIcon,
  GiftIcon, LibraryIcon, LightningBoltIcon, LinkIcon, LocationMarkerIcon, MicrophoneIcon,
  OfficeBuildingIcon, PresentationChartBarIcon, PrinterIcon, ReceiptRefundIcon, SaveIcon, ScaleIcon,
  SearchIcon, ServerIcon, SparklesIcon, SpeakerphoneIcon, TicketIcon, TrophyIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: '图标'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const container = ref(null);

// 图标列表
const icons = [
  { name: 'academic-cap', component: AcademicCapIcon },
  { name: 'bell', component: BellIcon },
  { name: 'book-open', component: BookOpenIcon },
  { name: 'calendar', component: CalendarIcon },
  { name: 'chat', component: ChatIcon },
  { name: 'check-circle', component: CheckCircleIcon },
  { name: 'chip', component: ChipIcon },
  { name: 'clock', component: ClockIcon },
  { name: 'code', component: CodeIcon },
  { name: 'cog', component: CogIcon },
  { name: 'collection', component: CollectionIcon },
  { name: 'cube', component: CubeIcon },
  { name: 'database', component: DatabaseIcon },
  { name: 'desktop-computer', component: DesktopComputerIcon },
  { name: 'device-mobile', component: DeviceMobileIcon },
  { name: 'document', component: DocumentIcon },
  { name: 'document-text', component: DocumentTextIcon },
  { name: 'fire', component: FireIcon },
  { name: 'globe', component: GlobeIcon },
  { name: 'heart', component: HeartIcon },
  { name: 'home', component: HomeIcon },
  { name: 'light-bulb', component: LightBulbIcon },
  { name: 'mail', component: MailIcon },
  { name: 'moon', component: MoonIcon },
  { name: 'music-note', component: MusicNoteIcon },
  { name: 'paper-clip', component: PaperClipIcon },
  { name: 'pencil', component: PencilIcon },
  { name: 'photograph', component: PhotographIcon },
  { name: 'puzzle', component: PuzzleIcon },
  { name: 'shield-check', component: ShieldCheckIcon },
  { name: 'shopping-bag', component: ShoppingBagIcon },
  { name: 'star', component: StarIcon },
  { name: 'sun', component: SunIcon },
  { name: 'tag', component: TagIcon },
  { name: 'truck', component: TruckIcon },
  { name: 'user', component: UserIcon },
  { name: 'video-camera', component: VideoCameraIcon },
  { name: 'view-grid', component: ViewGridIcon },
  { name: 'wifi', component: WifiIcon },
  { name: 'cake', component: CakeIcon },
  { name: 'currency-dollar', component: CurrencyDollarIcon },
  { name: 'beaker', component: BeakerIcon },
  { name: 'cash', component: CashIcon },
  { name: 'chart-bar', component: ChartBarIcon },
  { name: 'chart-pie', component: ChartPieIcon },
  { name: 'chart-square-bar', component: ChartSquareBarIcon },
  { name: 'cloud', component: CloudIcon },
  { name: 'color-swatch', component: ColorSwatchIcon },
  { name: 'credit-card', component: CreditCardIcon },
  { name: 'cube-transparent', component: CubeTransparentIcon },
  { name: 'emoji-happy', component: EmojiHappyIcon },
  { name: 'eye', component: EyeIcon },
  { name: 'film', component: FilmIcon },
  { name: 'folder', component: FolderIcon },
  { name: 'gift', component: GiftIcon },
  { name: 'library', component: LibraryIcon },
  { name: 'lightning-bolt', component: LightningBoltIcon },
  { name: 'link', component: LinkIcon },
  { name: 'location-marker', component: LocationMarkerIcon },
  { name: 'microphone', component: MicrophoneIcon },
  { name: 'office-building', component: OfficeBuildingIcon },
  { name: 'presentation-chart-bar', component: PresentationChartBarIcon },
  { name: 'printer', component: PrinterIcon },
  { name: 'receipt-refund', component: ReceiptRefundIcon },
  { name: 'save', component: SaveIcon },
  { name: 'scale', component: ScaleIcon },
  { name: 'search', component: SearchIcon },
  { name: 'server', component: ServerIcon },
  { name: 'sparkles', component: SparklesIcon },
  { name: 'speakerphone', component: SpeakerphoneIcon },
  { name: 'ticket', component: TicketIcon },
  { name: 'trophy', component: TrophyIcon }
];

// 获取选中图标的名称
const selectedIconName = computed(() => {
  if (!props.modelValue) return '';
  
  // 将图标名称格式化为更易读的形式
  return props.modelValue
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

// 获取图标组件
const getIconComponent = (iconName) => {
  const icon = icons.find(i => i.name === iconName);
  return icon ? icon.component : null;
};

// 切换下拉列表状态
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 选择图标
const selectIcon = (iconName) => {
  emit('update:modelValue', iconName);
  isOpen.value = false;
};

// 点击外部关闭下拉列表
const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  container.value = document.querySelector('.icon-picker');
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>