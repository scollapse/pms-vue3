// 消息弹窗工具类
const toast = {
    element: null,

    /**
     * 初始化消息弹窗容器
     */
    init() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'fixed top-4 right-4 z-50';
            document.body.appendChild(this.element);
        }
    },

    /**
     * 显示消息弹窗
     * @param {string} type - 消息类型 ('success' or 'error')
     * @param {string} message - 提示消息
     */
    show(type, message) {
        this.init();

        const toastElement = document.createElement('div');
        toastElement.className = `flex items-center p-4 mb-4 rounded-lg ${
            type === 'success' ? 'text-green-800 bg-green-100 ' : 'bg-red-100 text-red-800 '
        }`;
        toastElement.role = 'alert';

        const icon = type === 'success'
            ? `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`
            : `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`;

        toastElement.innerHTML = `${icon}<span>${message}</span>`;

        this.element.appendChild(toastElement);

        // 自动隐藏消息弹窗
        setTimeout(() => {
            toastElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                this.element.removeChild(toastElement);
            }, 300); // 等待过渡动画完成
        }, 3000);
    },

    error(message) {
        this.init();
        const toastElement = document.createElement('div');
        toastElement.className = `flex items-center p-4 mb-4 rounded-lg ${
            'bg-red-100 text-red-800 '
        }`;
        toastElement.role = 'alert';

        const icon =`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`;

        toastElement.innerHTML = `${icon}<span>${message}</span>`;

        this.element.appendChild(toastElement);

        // 自动隐藏消息弹窗
        setTimeout(() => {
            toastElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                this.element.removeChild(toastElement);
            }, 300); // 等待过渡动画完成
        }, 3000);
    },

    success(message){
        this.init();
        const toastElement = document.createElement('div');
        toastElement.className = `flex items-center p-4 mb-4 rounded-lg ${
            'text-green-800 bg-green-100 '
        }`;
        toastElement.role = 'alert';

        const icon =`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`;

        toastElement.innerHTML = `${icon}<span>${message}</span>`;

        this.element.appendChild(toastElement);

        // 自动隐藏消息弹窗
        setTimeout(() => {
            toastElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => {
                this.element.removeChild(toastElement);
            }, 300); // 等待过渡动画完成
        }, 3000);
    }
};

export default toast;