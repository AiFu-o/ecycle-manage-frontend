<template>
    <div>
        <icon-select></icon-select>
        <div>
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
            </a-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";

const that = getCurrentInstance().appContext.config.globalProperties;
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
        title: "图标",
        dataIndex: "icon",
    },
    {
        title: "服务费类型",
        dataIndex: "serviceChargeType",
    },
    {
        title: "服务费",
        dataIndex: "serviceChargeSetting",
    },
];

onMounted(() => {
    onLoad();
});
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
</script>