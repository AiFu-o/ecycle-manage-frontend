
<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo" />
            <a-menu
                v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="inline"
                :items="menuItems"
                @click="menuClick"
            />
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding-left: 20px">
                {{ title }}
            </a-layout-header>
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <!-- <a-breadcrumb-item>User</a-breadcrumb-item>
                    <a-breadcrumb-item>Bill</a-breadcrumb-item> -->
                </a-breadcrumb>
                <div
                    :style="{
                        padding: '24px',
                        background: '#fff',
                        height: 'calc(100% - 48px)',
                    }"
                >
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                <a href="https://beian.miit.gov.cn">京ICP备2024066385号</a>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
import { type } from "os";
import { onMounted, ref, Ref, getCurrentInstance, watch } from "vue";
import {
    RouterLink,
    RouterView,
    useRouter,
    RouteRecord,
    useRoute,
} from "vue-router";

const selectedKeys = ref([]);
const openKeys = ref([]);
var menuItems = ref([]);
const collapsed = false;
const title = ref("");
const router = useRouter();
const route = useRoute();

watch(
    () => route.meta, // 你可以监听 route 的 path、params 或 query
    (val) => {
        title.value = val.title.toString();
    }
);

onMounted(() => {
    title.value = route.meta.title.toString();
    buildMenuItems();
});

const buildMenuItems = () => {
    const routeRecords: RouteRecord[] = router.getRoutes();
    let menuItemsMap = new Map();

    routeRecords.forEach((routeRecord) => {
        if (
            routeRecord.meta &&
            (routeRecord.meta.group || routeRecord.meta.group == false)
        ) {
            let menuItemList = [];
            const recordMeta: object = routeRecord.meta;
            let group: string;
            group = recordMeta["group"];

            if (menuItemsMap.has(group)) {
                menuItemList = menuItemsMap.get(group);
            } else {
                menuItemList = [];
            }
            menuItemList.push({
                key: routeRecord.name,
                title: routeRecord.meta.title,
                label: routeRecord.meta.title,
            });
            menuItemsMap.set(group, menuItemList);
        }
    });
    let newMenuItems = [];
    for (const itemGroup of menuItemsMap.keys()) {
        const menuItemList = menuItemsMap.get(itemGroup);
        if (itemGroup) {
            newMenuItems.push({
                key: itemGroup,
                title: itemGroup,
                label: itemGroup,
                children: menuItemList,
            });
        } else {
            newMenuItems.push(menuItemList[0]);
        }
    }
    menuItems.value = newMenuItems;
};

const menuClick = ({ item, key, keyPath }) => {
    router.push({ name: key });
};
</script>

<style scoped>
</style>