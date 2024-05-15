<template>
    <div>
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
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        {{statusData[record.status]}}
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-button type="text" @click="show(record.id)">{{
                            record.status == "PENDING" ? "审批" : "查看"
                        }}</a-button>
                    </template>
                </template>
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
        title: "姓名",
        dataIndex: "name",
        ellipsis: true,
    },
    {
        title: "身份证号",
        dataIndex: "idCard",
        ellipsis: true,
    },

    {
        title: "手机号",
        dataIndex: "telephone",
    },
    {
        title: "状态",
        key: "status",
    },
    {
        title: "创建时间",
        dataIndex: "createTime",
        minWidth: 200,
    },
    {
        title: "审批时间",
        dataIndex: "auditTime",
        minWidth: 200,
    },
    {
        title: "操作",
        key: "action",
        align: "center",
    },
];

const statusData = {
    PENDING: "待审批",
    APPROVE: "审批通过",
    REJECT: "已驳回",
    DISCARD: "已废弃",
};

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

const onLoad = () => {
    that.$API({
        method: "POST",
        url: "/auth-api/provider-apply/pageQueryAll",
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

const show = (id) => {
    that.$router.push(`/provider-apply/detail/${id}`);
};
</script>