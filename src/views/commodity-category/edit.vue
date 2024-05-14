<template>
    <div>
        <a-form :model="categroyData" name="basic" :rules="formRules">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="categroyData.name" />
            </a-form-item>
            <a-form-item label="标题" name="title">
                <a-input v-model:value="categroyData.username" />
            </a-form-item>
            <a-form-item label="图标" name="iconFileId">
                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :maxCount="1"
                    @remove="removeFile"
                    @change="fileUploadChange"
                    :customRequest="customRequest"
                >
                    <a-button>上传图标</a-button>
                </a-upload>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import { onMounted, reactive, ref, UnwrapRef, getCurrentInstance } from "vue";
import type { UploadProps } from "ant-design-vue";
import cookieUtils from "../../libs/cookie/cookie";

const that = getCurrentInstance().appContext.config.globalProperties;

const authorization = ref("");
const fileList = ref<UploadProps["fileList"]>([]);
const formRules: Record<string, Rule[]> = {
    name: [{ required: true, message: "请输入名称" }],
    title: [{ required: true, message: "请输入标题" }],
    iconFileId: [{ required: true, message: "请上传图标", trigger: "change" }],
};
interface CategroyData {
    title: string;
    name: string;
    iconFileId: string;
    id?: string;
    serviceChargeType: string;
    serviceCharge: number;
}
const categroyData: UnwrapRef<CategroyData> = reactive({
    title: "",
    name: "",
    iconFileId: "",
    serviceChargeType: "",
    serviceCharge: 0,
});

onMounted(() => {
    getCookie();
});
const customRequest = (options) => {
    const formData = new FormData();
    formData.append("file", options.file);
    that.$API({
        method: "POST",
        url: `/storage-api/uploadFile`,
        headers: {
            "content-type": "multipart/form-data",
        },
        data: formData,
    })
        .then((res) => {
            options.file.id = res.data.result;
            options.onSuccess();
        })
        .catch((error) => {
            options.onError(error);
        });
};

const beforeUpload = (file, fileList) => {
    if (fileList.value.length > 0) {
        return removeFile(fileList.value[0]);
    }
    return true;
};
const removeFile = (file) => {
    return new Promise((resolve, reject) => {
        that.$API({
            method: "DELETE",
            url: `/storage-api/file/${file.id}`,
        })
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject();
            });
    });
};
const getCookie = () => {
    authorization.value = cookieUtils.get("Authorization");
};
</script>

<style lang="less" scoped>
</style>