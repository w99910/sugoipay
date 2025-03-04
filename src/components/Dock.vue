<template>
    <div ref="dockRef" :class="cn(
        'supports-backdrop-blur:bg-white/10 fixed z-10 bottom-4 left-1/2 transform -translate-x-1/2 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max rounded-2xl border p-2 backdrop-blur-md transition-all gap-4',
        $props.class,
        dockClass,
    )
        " @mousemove="onMouseMove" @mouseleave="onMouseLeave">
        <DockIcon #default="{ width }">
            <Workflow :size="width * 0.7" />
        </DockIcon>
        <DockIcon #default="{ width }">
            <Table2 :size="width * 0.7" />
        </DockIcon>
        <DockIcon #default="{ width }">
            <Settings :size="width * 0.7" />
        </DockIcon>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { cn } from "@/lib/utils";
import { Workflow, Table2, Settings } from "lucide-vue-next";
import DockIcon from "./DockIcon.vue";
const props = defineProps({
    class: {
        type: String,
        default: "",
    },
    magnification: {
        type: Number,
        default: 20,
    },
    distance: {
        type: Number,
        default: 100,
    },
    direction: {
        type: String,
        default: "middle",
    },
});

const dockRef = ref<HTMLElement | null>(null);
const mouseX = ref(Infinity);

const dockClass = computed(() => ({
    "items-start": props.direction === "top",
    "items-center": props.direction === "middle",
    "items-end": props.direction === "bottom",
}));

function onMouseMove(e: MouseEvent) {
    requestAnimationFrame(() => {
        mouseX.value = e.pageX;
    });
}

function onMouseLeave() {
    mouseX.value = Infinity;
}

provide("mouseX", mouseX);
provide("magnification", props.magnification);
provide("distance", props.distance);
</script>