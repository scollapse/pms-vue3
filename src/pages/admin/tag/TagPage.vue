<template>
    <div class="space-y-4">
        <search-bar :fields="searchFields" :filters="filters" :refresh="refreshData" />
        <tag-list :tags="tags" :isLoading="isLoading" @add-tag="showAddTagDialog" @delete-tag="onDeleteTag" />
        <pagination :load-data="loadTags" :filters="filters" ref="pagination" />
        <ModalForm ref="addTagModal" :isLoading="isConfirmLoading" :title="'新增标签'" :dialogWidth="'w-96'"
            :confirmButtonText="'新增'" @submit="handleAddTag" @close="clearForm">
            <div class="flex flex-wrap gap-2">
                <!-- 标签列表 -->
                <el-tag v-for="tag in tagList" :key="tag" closable :disable-transitions="true" @close="removeTag(tag)">
                    {{ tag }}
                </el-tag>

                <!-- 输入框 -->
                <input v-if="inputVisible" ref="inputRef" v-model="newTagName" class="w-20 pl-2"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />

                <!-- 新增标签按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">
                    + 新增标签
                </el-button>
            </div>
        </ModalForm>
    </div>
</template>

<script>
import { nextTick, ref } from 'vue';
import SearchBar from "@/components/SearchBar.vue";
import TagList from "@/pages/admin/tag/TagList.vue";
import Pagination from "@/components/Pagination.vue";
import { fetchTags, addTag, deleteTag } from "@/api/admin/tag";
import toast from "@/composables/utils/toast";
import modal from '@/composables/utils/modal';
import ModalForm from '@/components/ModalForm.vue';



export default {
    components: {
        SearchBar,
        TagList,
        Pagination,
        ModalForm
    },
    setup() {
        const tags = ref([]);
        const filters = ref({});
        const pagination = ref(null); // 分页组件实例
        const addTagModal = ref(null); // ModalForm 组件实例
        const form = ref({ tagName: '' });
        const isLoading = ref(false);
        const isConfirmLoading = ref(false);

        const newTagName = ref(''); // 新增标签名称
        const tagList = ref([]); // 标签列表
        const inputVisible = ref(false); // 控制输入框显示
        const inputRef = ref(null); // 输入框实例


        // 显示输入框
        const showInput = () => {
            inputVisible.value = true;
            nextTick(() => {
                inputRef.value.focus();
            });
        };

        // 确认输入
        const handleInputConfirm = () => {
            const trimmedTag = newTagName.value.trim();
            if (trimmedTag) {
            if (tagList.value.includes(trimmedTag)) {
                toast.show('error', '标签已新增入列表');
            } else {
                tagList.value.push(trimmedTag);
            }
            newTagName.value = ''; // 清空输入框
            }
            inputVisible.value = false;
        };

        // 移除标签
        const removeTag = (tag) => {
            tagList.value.splice(tagList.value.indexOf(tag), 1);
        };

        // 清空表单
        const clearForm = () => {
            tagList.value = [];
            newTagName.value = '';
            inputVisible.value = false;
        };

        // 处理提交
        const handleAddTag = async () => {
            if (tagList.value.length === 0) {
                toast.show('error', '请至少添加一个标签');
                return;
            }

            isConfirmLoading.value = true;
            try {
                const res = await addTag({ tagNames: tagList.value });
                if (res.success) {
                    toast.show('success', '新增标签成功');
                    addTagModal.value.closeModal();
                    refreshData(filters.value); // 刷新数据
                } else {
                    toast.show('error', res.errorMessage);
                }
            } catch (error) {
                console.error('新增标签失败:', error);
                toast.show('error', '新增标签失败，请重试');
            } finally {
                isConfirmLoading.value = false;
            }
        };
        // 定义搜索 Bar
        const searchFields = ref([
            { type: 'input', values: [{ key: 'name', value: '标签名称' }] },
            { type: 'daterangePicker', values: [{ key: '', value: '' }] },
        ]);

        // 加载标签数据
        const loadTags = async (currentPage, pageSize, filters, setTotal) => {
            isLoading.value = true;
            try {
                const res = await fetchTags({
                    current: currentPage,
                    size: pageSize,
                    startDate: filters.startDate || "",
                    endDate: filters.endDate || "",
                    name: filters.name || "",
                });
                if (res.success) {
                    tags.value = res.total > 0 ? res.data : [];
                    setTotal(res.total); // 更新总数据量
                }
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            } finally {
                isLoading.value = false;
            }
        };

        // 刷新数据
        const refreshData = (newFilters) => {
            if (pagination.value) {
                pagination.value.refresh(newFilters);
            }
        };

        // 初始化加载数据
        loadTags(1, 10, filters.value, (total) => {
            if (pagination.value) {
                pagination.value.setTotal(total); // 调用 setTotal 方法
            }
        });

        // 显示新增标签对话框
        const showAddTagDialog = () => {
            addTagModal.value.openModal();
        };

        // 隐藏新增标签对话框
        const hideAddTagDialog = () => {
            addTagModal.value.closeModal();
        };

        // 删除标签
        const onDeleteTag = async (id) => {
            console.log('Delete tag button clicked', id);
            modal.showConfirm('确定要删除吗？', () => {
                deleteTag({ id: id }).then((res) => {
                    if (!res.success) {
                        toast.show('error', '删除失败!');
                        return;
                    }
                    toast.show('success', '删除成功!');
                    refreshData(filters.value); // 刷新数据
                });
            });
        };

        return {
            tags,
            filters,
            searchFields,
            loadTags,
            showAddTagDialog,
            hideAddTagDialog,
            handleAddTag,
            pagination,
            refreshData,
            onDeleteTag, // 确保定义 onDeleteTag 方法
            addTagModal,
            form,
            isLoading,
            clearForm,
            isConfirmLoading,
            newTagName,
            tagList,
            inputVisible,
            showInput,
            handleInputConfirm,
            removeTag,
            inputRef,
        };
    },
};
</script>