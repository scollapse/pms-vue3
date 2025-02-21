import { createApp } from "vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

class ModalUtil {
  constructor() {
    const modalApp = createApp(ConfirmModal);
    const container = document.createElement("div");
    document.body.appendChild(container);
    this.instance = modalApp.mount(container);
  }

  /**
   * 显示确认弹窗
   * @param {string} message - 提示信息
   * @param {function} callback - 确定按钮的回调函数
   */
  showConfirm(message, callback) {
    this.instance.openModal(message, callback);
  }
}

// 创建单例对象
export default new ModalUtil();