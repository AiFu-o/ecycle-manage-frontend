
<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo" />
            <a-menu
                v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="inline"
                :items="breadcrumbItems"
                @click="menuClick"
            />
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0" />
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item>User</a-breadcrumb-item>
                    <a-breadcrumb-item>Bill</a-breadcrumb-item>
                </a-breadcrumb>
                <div
                    :style="{
                        padding: '24px',
                        background: '#fff',
                        minHeight: '360px',
                    }"
                >
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
import { type } from "os";
import { onMounted, ref, Ref } from "vue";
import { RouterLink, RouterView, useRouter, RouteRecord } from "vue-router";

const selectedKeys = ref([]);
const openKeys = ref([]);
var breadcrumbItems = ref([]);
const collapsed = false;

const router = useRouter();
onMounted(() => {
    buildMenuItems();
});

const buildMenuItems = () => {
    const routeRecords: RouteRecord[] = router.getRoutes();
    let breadcrumbItemsMap = new Map();
    routeRecords.forEach((routeRecord) => {
        if (
            routeRecord.meta &&
            (routeRecord.meta.group || routeRecord.meta.group == false)
        ) {
            let breadcrumbItemList = [];
            const recordMeta: object = routeRecord.meta;
            let group: string;
            group = recordMeta["group"];

            if (breadcrumbItemsMap.has(group)) {
                breadcrumbItemList = breadcrumbItemsMap.get(group);
            } else {
                breadcrumbItemList = [];
            }
            breadcrumbItemList.push({
                key: routeRecord.name,
                title: routeRecord.meta.title,
                label: routeRecord.meta.title,
            });
            breadcrumbItemsMap.set(group, breadcrumbItemList);
        }
    });
    let newBreadcrumbItems = [];
    for (const itemGroup of breadcrumbItemsMap.keys()) {
        const breadcrumbItemList = breadcrumbItemsMap.get(itemGroup);
        if (itemGroup) {
            newBreadcrumbItems.push({
                key: itemGroup,
                title: itemGroup,
                label: itemGroup,
                children: breadcrumbItemList,
            });
        } else {
            newBreadcrumbItems.push(breadcrumbItemList[0]);
        }
    }
    breadcrumbItems.value = newBreadcrumbItems;
};

const menuClick = ({ item, key, keyPath }) => {
    router.push(key);
};
</script>

<style scoped>

</style>