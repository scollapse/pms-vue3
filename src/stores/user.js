import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo } from "@/api/admin/user";
import { removeToken } from '@/composables/utils/cookie'

export const useUserStore = defineStore("user", {
    state: () => ({
        userInfo: ref({}), // 用户信息
    }),
    actions: {
        setUserInfo() {
            // 调用接口获取用户信息
            getUserInfo().then((res) => {
                // 打印返回的数据
                if (res.success) {
                    this.userInfo.value = res.data;
                }
            });
        },
        logout() {
            // 清空用户信息
            removeToken();
            this.userInfo.value = {};
        }
    },
    persist: true // 开启持久化
});
