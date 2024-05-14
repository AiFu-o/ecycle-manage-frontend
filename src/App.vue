
<template>
    <div style="width: 100%; height: 100%">
        <router-view />
    </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped>

#app {
    width: 100%;
    height: 100%;
}
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
    background: #141414;
}
</style>