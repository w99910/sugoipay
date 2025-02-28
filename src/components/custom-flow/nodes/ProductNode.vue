<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { LayoutGrid } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';

const props = defineProps(['data', 'type', 'label', 'id'])

const data = reactive({
    name: props.data.name
})

console.log('mounted product node')

</script>

<template>
    <div class="custom-node">
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <span>{{ id }}</span>
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-purple-500">
                <LayoutGrid :size="common.iconSize" color="white" />
            </div> <input class="nodrag font-semibold text-purple-500" type="text" placeholder="Enter product name"
                v-model="data.name" />
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
