import { ref } from 'vue';
import { modifyPassword } from '@/api/admin/user';
import toast from '@/composables/utils/toast';
import { useUserStore } from '@/stores/user';
import router from '@/router/index';

export function useModifyUser() {
    const visible = ref(false);
    const errors = ref({});
    const form = ref({
        username: '',
        password: '',
        confirm_password: ''
    });
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const { logout } = useUserStore();
    const openModal = (email) => {
        form.value.username = email;
        visible.value = true;
    };

    const closeModal = () => {
        visible.value = false;
        form.value.username = '';
        form.value.password = '';
        form.value.confirm_password = '';
    };

    const submitForm = () => {
        // 验证表单
        if (!validateForm()) {
            // 如果验证失败，直接返回
            return;
        }
        // 验证通过后调用修改密码接口
        modifyPassword(form.value.username, form.value.password).then((res) => {
            if (res.success) {
                // 修改成功后关闭弹窗重新登录
                closeModal();
                logout();
                toast.show('success', '密码修改成功，请重新登录');
                // 跳转登录页
                router.push('/login');
                
            }else {
                let message = res.errorMessage;
                toast.show('error', message);
            }
        })
        .catch((error) => {
            console.error('更新密码失败:', error);
        });
    };

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };

    const toggleConfirmPasswordVisibility = () => {
        showConfirmPassword.value = !showConfirmPassword.value;
    };

    const validateForm = () => {
        errors.value = {};

        if (!form.value.password) {
            errors.value.password = 'Password is required.';
        }

        if (!form.value.confirm_password) {
            errors.value.confirm_password = 'Please confirm your password.';
        } else if (form.value.password !== form.value.confirm_password) {
            errors.value.confirm_password = 'Passwords do not match.';
        }

        return Object.keys(errors.value).length === 0;
    };

    return {
        visible,
        errors,
        form,
        showPassword,
        showConfirmPassword,
        openModal,
        closeModal,
        submitForm,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility
    };
}
