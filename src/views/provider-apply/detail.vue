<template>
    <div>
        <a-form
            :model="applyData"
            ref="formRef"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            :rules="formRules"
        >
            <a-form-item label="姓名" name="name">
                <a-input disabled v-model:value="applyData.name" />
            </a-form-item>
            <a-form-item label="身份证" name="idCard">
                <a-input disabled v-model:value="applyData.idCard" />
            </a-form-item>
            <a-form-item label="手机号" name="telephone">
                <a-input disabled v-model:value="applyData.telephone" />
            </a-form-item>
            <a-form-item label="审批状态" name="status">
                <a-input disabled v-model:value="applyData.status" />
            </a-form-item>
            <a-form-item label="创建时间" name="createTime">
                <a-input disabled v-model:value="applyData.createTime" />
            </a-form-item>
            <a-form-item label="审批时间" name="telephone">
                <a-input disabled v-model:value="applyData.auditTime" />
            </a-form-item>

            <a-form-item label="身份证">
                <a-image-preview-group
                    v-for="item in idCardFiles"
                    :key="item.id"
                >
                    <a-image
                        style="
                            border: 1px solid rgba(5, 5, 5, 0.06);
                            padding: 5px;
                            margin-right: 20px;
                        "
                        :width="200"
                        :src="item"
                    />
                </a-image-preview-group>
            </a-form-item>

            <a-form-item label="手持身份证">
                <a-image-preview-group
                    v-for="item in handIdCardFiles"
                    :key="item.id"
                >
                    <a-image
                        style="
                            border: 1px solid rgba(5, 5, 5, 0.06);
                            padding: 5px;
                            margin-right: 20px;
                        "
                        :width="200"
                        :src="item"
                    />
                </a-image-preview-group>
            </a-form-item>

            <a-form-item label="审批意见" name="approvalMessage">
                <a-textarea
                    :rows="4"
                    v-model:value="applyData.approvalMessage"
                    :disabled="applyData.status !== '待审批'"
                />
            </a-form-item>

            <a-form-item
                :wrapper-col="{ span: 24 }"
                style="text-align: center"
                v-if="applyData.status === '待审批'"
            >
                <a-button
                    type="primary"
                    @click="submit(true)"
                    :loading="loading"
                    >通过</a-button
                >
                <a-button
                    style="margin-left: 40px"
                    @click="submit(false)"
                    :loading="loading"
                    >驳回</a-button
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
import moment from "moment";

const loading = ref(false);

const formRef = ref();

const that = getCurrentInstance().appContext.config.globalProperties;

const authorization = ref("");
const fileList = ref<UploadProps["fileList"]>([]);
const formRules: Record<string, Rule[]> = {
    approvalMessage: [{ required: true, message: "请填写审批意见" }],
};
interface ApplyData {
    name: string;
    belongId: string;
    idCard: string;
    telephone: string;
    status: string;
    approvalMessage?: string;
    createTime: Date | string;
    auditTime: Date | string;
    id: string;
}
const applyData: UnwrapRef<ApplyData> = reactive({
    name: "",
    belongId: "",
    idCard: "",
    telephone: "",
    status: "",
    approvalMessage: "",
    createTime: "",
    auditTime: "",
    id: "",
});

const statusData = {
    PENDING: "待审批",
    APPROVE: "审批通过",
    REJECT: "已驳回",
    DISCARD: "已废弃",
};

const dataId = ref<string>("");

const handIdCardFiles = ref([]);
const idCardFiles = ref([]);

onMounted(() => {
    let params = that.$route.params;
    dataId.value = params.id.toString();
    onLoad();
    getCookie();
});

const loadIdcardFiles = (belongId) => {
    that.$API({
        method: "GET",
        url: `/storage-api/fileInfos/idcard?belongId=${belongId}`,
    })
        .then((res) => {
            let data = res.data.result;
            idCardFiles.value = data;
        })
        .catch((error) => {
            message.error("获取身份证失败");
        });
};

const loadHandIdCardFiles = (belongId) => {
    that.$API({
        method: "GET",
        url: `/storage-api/fileInfos/handIdcard?belongId=${belongId}`,
    })
        .then((res) => {
            let data = res.data.result;
            handIdCardFiles.value = data;
        })
        .catch((error) => {
            message.error("获取身份证失败");
        });
};

const onLoad = () => {
    loading.value = true;
    that.$API({
        method: "GET",
        url: `/auth-api/provider-apply/load/${dataId.value}`,
    })
        .then((res) => {
            let data = res.data.result;
            loadIdcardFiles(data.belongId);
            loadHandIdCardFiles(data.belongId);
            data.status = statusData[data.status];
            Object.assign(applyData, data);
            loading.value = false;
        })
        .catch((error) => {
            message.error("获取数据失败");
            loading.value = false;
        });
};

const getCookie = () => {
    authorization.value = cookieUtils.get("Authorization");
};

const submit = (approve) => {
    formRef.value
        .validate()
        .then(() => {
            doSave(approve);
        })
        .catch((error) => {
            console.log("error", error);
        });
};

const doSave = (approve) => {
    loading.value = true;

    that.$API({
        method: "PUT",
        url: `/auth-api/provider-apply/completed/${dataId.value}`,
        data: {
            approve,
            approvalMessage: applyData.approvalMessage,
        },
    })
        .then((res) => {
            loading.value = false;
            if (res.data.code == 0) {
                message.success("审批成功");
                that.$router.push("/provider-apply");
            } else {
                message.error("审批失败,", res.data.message);
            }
        })
        .catch(() => {
            message.error("保存失败,未知异常");
            loading.value = false;
        });
};
</script>

<style lang="less" scoped>
</style>