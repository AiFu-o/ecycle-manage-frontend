<template>
    <div>
        <div>
            <a-table :dataSource="data" :columns="columns">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <a-popconfirm
                            title="是否下架该商品?"
                            @confirm="onDelete(record.id)"
                        >
                            <a>删除</a>
                        </a-popconfirm>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";

const that = getCurrentInstance().appContext.config.globalProperties;

const data = ref([]);
const columns = [
    {
        title: "商品标题",
        dataIndex: "name",
    },
    {
        title: "当前出价",
        dataIndex: "amount",
    },
    {
        title: "浏览量",
        dataIndex: "pageViews",
    },
    {
        title: "操作",
        dataIndex: "operation",
    },
];
onMounted(() => {
    onLoad();
});
const onDelete = (id) => {};
const onLoad = () => {
    that.$API({
        method: "POST",
        url: "/commodity-api/commodity/pageQueryAll",
        headers: {
            "content-type": "application/json",
        },
        data: {
            isPage: false,
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