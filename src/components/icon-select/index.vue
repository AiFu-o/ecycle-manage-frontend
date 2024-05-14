<template>
    <div>
        <a-select
            v-model:value="props.value"
            style="width: 100%"
            placeholder="请选择图标"
            option-label-prop="children"
            v-bind="$attrs"
        >
            <a-select-option
                v-for="item in iconList"
                :key="item.icon_id"
                :value="'icon-' + item.font_class"
                :label="item.name"
            >
                <i
                    style="font-size: 12px; color: red"
                    :class="`iconfont icon-${item.font_class}`"
                ></i>
                {{ item.name }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconData from "../../static/iconfont/iconfont.json";

const iconList = ref(IconData.glyphs);
const props = defineProps({
    value: { type: String, required: true },
});
</script>