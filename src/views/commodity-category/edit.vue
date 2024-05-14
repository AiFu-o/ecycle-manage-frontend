<template>
    <div>
        <a-form
            :model="categroyData"
            ref="formRef"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            :rules="formRules"
        >
            <a-form-item label="名称" name="name">
                <a-input v-model:value="categroyData.name" />
            </a-form-item>
            <a-form-item label="标题" name="title">
                <a-input v-model:value="categroyData.title" />
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
            <a-form-item label="服务费类型" name="serviceChargeType">
                <a-select
                    ref="select"
                    v-model:value="categroyData.serviceChargeType"
                    @focus="focus"
                    @change="handleChange"
                >
                    <a-select-option value="RATIO_PAYMENT"
                        >按比例支付</a-select-option
                    >
                    <a-select-option value="FIXED_PAYMENT"
                        >定额支付</a-select-option
                    >
                </a-select>
            </a-form-item>
            <a-form-item label="服务费" name="serviceChargeSetting">
                <a-input-number
                    v-if="categroyData.serviceChargeType == 'RATIO_PAYMENT'"
                    v-model:value="categroyData.serviceChargeSetting"
                    style="width: 100%"
                    :min="0"
                    :max="100"
                    :formatter="
                        (val) => {
                            return `${val}%`;
                        }
                    "
                    :parser="
                        (val) => {
                            return val.replace('%', '');
                        }
                    "
                />
                <a-input-number
                    v-else
                    style="width: 100%"
                    v-model:value="categroyData.serviceChargeSetting"
                    :min="0"
                    :formatter="
                        (val) => {
                            return `${val}元`;
                        }
                    "
                    :parser="
                        (val) => {
                            return val.replace('元', '');
                        }
                    "
                />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
                <a-button type="primary" @click="submit" :loading="loading"
                    >提交</a-button
                >
                <a-button
                    style="margin-left: 40px"
                    @click="reset"
                    :loading="loading"
                    >重置</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import { message } from "ant-design-vue";

import {
    onMounted,
    reactive,
    ref,
    UnwrapRef,
    getCurrentInstance,
    computed,
} from "vue";
import type { UploadProps } from "ant-design-vue";
import cookieUtils from "../../libs/cookie/cookie";

const loading = ref(false);

const formRef = ref();

const that = getCurrentInstance().appContext.config.globalProperties;

const authorization = ref("");
const fileList = ref<UploadProps["fileList"]>([]);
const formRules: Record<string, Rule[]> = {
    name: [{ required: true, message: "请输入名称" }],
    title: [{ required: true, message: "请输入标题" }],
    iconFileId: [{ required: true, message: "请上传图标", trigger: "change" }],
    serviceChargeType: [
        { required: true, message: "请选择服务费类型", trigger: "change" },
    ],
    serviceChargeSetting: [
        { required: true, message: "请输入服务费", type: "number" },
    ],
};
interface CategroyData {
    title: string;
    name: string;
    iconFileId: string;
    id?: string;
    serviceChargeType: string;
    serviceChargeSetting: number;
}
const categroyData: UnwrapRef<CategroyData> = reactive({
    title: "",
    name: "",
    iconFileId: "",
    serviceChargeType: "RATIO_PAYMENT",
    serviceChargeSetting: 0,
});

const dataId = ref<string>("");

onMounted(() => {
    let params = that.$route.params;
    if (params.id) {
        dataId.value = params.id.toString();
        onLoad();
    }
    getCookie();
});

const onLoad = () => {
    loading.value = true;
    that.$API({
        method: "GET",
        url: `/commodity-api/commodity-category/load/${dataId.value}`,
    })
        .then((res) => {
            Object.assign(categroyData, res.data.result);
            fileList.value = [
                {
                    uid: categroyData.iconFileId,
                    name: "图标.png",
                    status: "done",
                    url: `/api/storage-api/file/preview/${categroyData.iconFileId}`,
                    thumbUrl: `/api/storage-api/file/preview/${categroyData.iconFileId}`,
                },
            ];
            loading.value = false;
        })
        .catch((error) => {
            message.error("获取数据失败");
            loading.value = false;
        });
};

const serviceChargeFormat = (val) => {
    if (categroyData.serviceChargeType == "RATIO_PAYMENT") {
        return `${val}%`;
    } else {
        return `${val}元`;
    }
};

const serviceChargeParser = (val) => {
    if (categroyData.serviceChargeType == "RATIO_PAYMENT") {
        return val.replace("%", "");
    } else {
        return val.replace("元", "");
    }
};

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
            categroyData.iconFileId = res.data.result;
            options.onSuccess();
        })
        .catch((error) => {
            options.onError(error);
        });
};

const beforeUpload = (file, fileList) => {
    if (categroyData.iconFileId) {
        return removeFile(categroyData.iconFileId);
    }
    return true;
};
const removeFile = (file) => {
    return new Promise((resolve, reject) => {
        that.$API({
            method: "DELETE",
            url: `/storage-api/file/${categroyData.iconFileId}`,
        })
            .then(() => {
                categroyData.iconFileId = "";
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

const submit = () => {
    formRef.value
        .validate()
        .then(() => {
            doSave();
        })
        .catch((error) => {
            console.log("error", error);
        });
};

const doSave = () => {
    loading.value = true;
    that.$API({
        method: dataId.value ? "PUT" : "POST",
        url: `/commodity-api/commodity-category/save`,
        data: categroyData,
    })
        .then((res) => {
            loading.value = false;
            if (res.data.code == 0) {
                message.success("保存成功");
                that.$router.push("/commodity-category");
            } else {
                message.error("保存失败,", res.data.message);
            }
        })
        .catch(() => {
            message.error("保存失败,未知异常");
            loading.value = false;
        });
};

const reset = () => {
    if (dataId) {
        onLoad();
    } else if (categroyData.iconFileId) {
        removeFile(fileList.value[0]).then(() => {
            fileList.value = [];
            formRef.value.resetFields();
        });
    } else {
        formRef.value.resetFields();
    }
};
</script>

<style lang="less" scoped>
</style>