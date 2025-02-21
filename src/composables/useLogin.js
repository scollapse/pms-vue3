import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/admin/user';
import toast from '@/composables/utils/toast.js';
import { setToken } from '@/composables/utils/cookie';
import { useUserStore } from '@/stores/user';

export function useLogin() {
    const router = useRouter();
    const userStore = useUserStore();

    // 定义响应式的表单对象
    const form = reactive({
        email: '',
        password: '',
        confirm_password: '',
        errors: {}, // 用于存储错误信息
    });

    // 密码可见性切换
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };

    const toggleConfirmPasswordVisibility = () => {
        showConfirmPassword.value = !showConfirmPassword.value;
    };

    const validateForm = () => {
        // 清空之前的错误
        form.errors = {};

        // 验证邮箱
        if (!form.email) {
            form.errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            form.errors.email = 'Invalid email address.';
        }

        // 验证密码
        if (!form.password) {
            form.errors.password = 'Password is required.';
        }

        // 验证确认密码
        if (!form.confirm_password) {
            form.errors.confirm_password = 'Please confirm your password.';
        } else if (form.password !== form.confirm_password) {
            form.errors.confirm_password = 'Passwords do not match.';
        }

        // 如果错误对象为空，则验证通过
        return Object.keys(form.errors).length === 0;
    };

    // 登录
    const onSubmit = (e) => {
        e.preventDefault(); // 阻止默认表单提交

        // 验证表单
        if (!validateForm()) {
            // 如果验证失败，直接返回
            return;
        }

        // 验证通过后调用登录接口
        login(form.email, form.password)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    toast.show('success', '登陆成功!');
                    // 存储 token
                    let token = res.data.token;
                    setToken(token);
                    // 获取用户信息 存储到全局状态
                    userStore.setUserInfo();
                    router.push('/admin/index');
                } else {
                    let message = res.errorMessage;
                    toast.show('error', message);
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return {
        form,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        onSubmit,
    };
}
