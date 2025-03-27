<template>
  <font-awesome-icon 
    :icon="getIcon(name)" 
    :class="[sizeClass, colorClass]"
  />
</template>

<script setup>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faGraduationCap, faBell, faBookOpen, faCalendar, faComments, 
  faCheckCircle, faMicrochip, faClock, faCode, faCog, faLayerGroup, 
  faCube, faDatabase, faDesktop, faMobile, faFile, faFileLines, 
  faFire, faGlobe, faHeart, faHome, faLightbulb, faEnvelope, 
  faMoon, faMusic, faPaperclip, faPencil, faImage, faPuzzlePiece, 
  faShieldHalved, faBagShopping, faStar, faSun, faTag, faTruck, 
  faUser, faVideo, faTableCells, faWifi, faCake, faDollarSign, 
  faFlask, faSackDollar, faChartBar, faChartPie, faChartColumn, 
  faCloud, faPalette, faCreditCard, faCubes, faFaceSmile, faEye, 
  faFilm, faFolder, faGift, faBolt, faLink, faLocationDot, 
  faMicrophone, faBuilding, faPrint, faReceipt, 
  faDownload, faScaleBalanced, faMagnifyingGlass, faServer, 
  faWandSparkles, faBullhorn, faTicket, faTrophy, faPlus, 
  faChevronLeft, faChevronRight, faCheck, faChevronDown, 
  faCircleQuestion, faTrash, faEdit, faArrowRight, faArrowLeft, 
  faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'gray'
  },
  variant: {
    type: String,
    default: 'solid'
  }
});

const iconMap = {
  'academic-cap': faGraduationCap,
  'bell': faBell,
  'book-open': faBookOpen,
  'calendar': faCalendar,
  'chat': faComments,
  'check-circle': faCheckCircle,
  'chip': faMicrochip,
  'clock': faClock,
  'code': faCode,
  'cog': faCog,
  'collection': faLayerGroup,
  'cube': faCube,
  'database': faDatabase,
  'desktop-computer': faDesktop,
  'device-mobile': faMobile,
  'document': faFile,
  'document-text': faFileLines,
  'fire': faFire,
  'globe': faGlobe,
  'heart': faHeart,
  'home': faHome,
  'light-bulb': faLightbulb,
  'mail': faEnvelope,
  'moon': faMoon,
  'music-note': faMusic,
  'paper-clip': faPaperclip,
  'pencil': faPencil,
  'photograph': faImage,
  'puzzle': faPuzzlePiece,
  'shield-check': faShieldHalved,
  'shopping-bag': faBagShopping,
  'star': faStar,
  'sun': faSun,
  'tag': faTag,
  'truck': faTruck,
  'user': faUser,
  'video-camera': faVideo,
  'view-grid': faTableCells,
  'wifi': faWifi,
  'cake': faCake,
  'currency-dollar': faDollarSign,
  'beaker': faFlask,
  'cash': faSackDollar,
  'chart-bar': faChartBar,
  'chart-pie': faChartPie,
  'chart-square-bar': faChartColumn,
  'cloud': faCloud,
  'color-swatch': faPalette,
  'credit-card': faCreditCard,
  'cube-transparent': faCubes,
  'emoji-happy': faFaceSmile,
  'eye': faEye,
  'film': faFilm,
  'folder': faFolder,
  'gift': faGift,
  'library': faBuilding,
  'lightning-bolt': faBolt,
  'link': faLink,
  'location-marker': faLocationDot,
  'microphone': faMicrophone,
  'office-building': faBuilding,
  'printer': faPrint,
  'receipt-refund': faReceipt,
  'save': faDownload,
  'scale': faScaleBalanced,
  'search': faMagnifyingGlass,
  'server': faServer,
  'sparkles': faWandSparkles,
  'speakerphone': faBullhorn,
  'ticket': faTicket,
  'trophy': faTrophy,
  'plus': faPlus,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'check': faCheck,
  'chevron-down': faChevronDown,
  'trash': faTrash,
  'edit': faEdit,
  'arrow-right': faArrowRight,
  'arrow-left': faArrowLeft,
  'arrow-up': faArrowUp,
  'arrow-down': faArrowDown
};

// 获取图标
const getIcon = (name) => {
  if (!iconMap[name]) {
    console.warn(`Icon '${name}' not found`);
    return faCircleQuestion;
  }
  return iconMap[name];
};

// 尺寸类
const sizeClass = computed(() => {
  const sizes = {
    'xs': 'fa-xs',
    'sm': 'fa-sm',
    'md': 'fa-lg',
    'lg': 'fa-xl',
    'xl': 'fa-2x',
    '2xl': 'fa-3x'
  };
  return sizes[props.size] || sizes.md;
});

// 颜色类
const colorClass = computed(() => {
  const colors = {
    'gray': 'text-gray-500',
    'red': 'text-red-500',
    'yellow': 'text-yellow-500',
    'green': 'text-green-500',
    'blue': 'text-blue-500',
    'indigo': 'text-indigo-500',
    'purple': 'text-purple-500',
    'pink': 'text-pink-500',
    'white': 'text-white'
  };
  return colors[props.color] || colors.gray;
});
</script>