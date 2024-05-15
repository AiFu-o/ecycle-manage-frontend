<template>
    <div>
        <div>
            <a-button
                type="primary"
                style="float: right; margin-bottom: 20px"
                @click="create"
                >新建</a-button
            >
            <a-table
                :pagination="{
                    current: pageIndex,
                    pageSize: pageSize,
                    showSizeChange: pageChange,
                    change: pageChange,
                    pageSizeOptions: pageSizeOptions,
                }"
                :dataSource="data"
                :columns="columns"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'serviceChargeType'">
                        {{serviceChargeTypeData[record.serviceChargeType]}}
                    </template>
                    <template v-else-if="column.key === 'iconFileId'">
                        <img
                            style="width: 20px; height: 20px"
                            :src="getFileUrl(record.iconFileId)"
                        />
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-button type="text" @click="edit(record.id)"
                            >编辑</a-button
                        >
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";

const that = getCurrentInstance().appContext.config.globalProperties;

const serviceChargeTypeData = {
    RATIO_PAYMENT: "按比例支付",
    FIXED_PAYMENT: "定额支付",
};
const pageSizeOptions = ref<string[]>(["10", "20"]);
const pageIndex = ref(1);
const pageSize = ref(10);
const total = ref(0);
const data = ref([]);
const columns = [
    {
        title: "名称",
        dataIndex: "name",
        ellipsis: true,
    },
    {
        title: "标题",
        dataIndex: "title",
        ellipsis: true,
    },

    {
        title: "服务费类型",
        key: "serviceChargeType",
    },
    {
        title: "服务费",
        dataIndex: "serviceChargeSetting",
    },
    {
        title: "图标",
        key: "iconFileId",
        width: 80,
    },
    {
        title: "操作",
        key: "action",
        align: "center",
    },
];

onMounted(() => {
    onLoad();
});

const getFileUrl = (fileId: string) => {
    return `/api/storage-api/file/preview/${fileId}`;
};

const pageChange = (current: number, size: number) => {
    if (pageSize.value != size) {
        pageSize.value = size;
    }
    if (pageIndex.value != current) {
        pageIndex.value = current;
    }
    onLoad();
};
const onDelete = (id) => {};
const onLoad = () => {
    that.$API({
        method: "POST",
        url: "/commodity-api/commodity-category/pageQueryAll",
        headers: {
            "content-type": "application/json",
        },
        data: {
            isPage: true,
            pageIndex: pageIndex.value,
            pageSize: pageSize.value,
        },
    }).then((response) => {
        if (response.data) {
            let result = response.data.result;
            console.log(result);
            data.value = result.dataList;
        }
    });
};

const edit = (id) => {
    that.$router.push(`/commodity-category/edit/${id}`);
};

const create = () => {
    that.$router.push(`/commodity-category/create`);
};
</script>