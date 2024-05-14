import type { App } from "vue";
import IconSelect from "./icon-select/index.vue";

const install = (Vue: App) => {
    Vue.component("IconSelect", IconSelect);
}

export default {
    IconSelect,
    install
}