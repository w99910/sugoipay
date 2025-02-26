<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { LayoutGrid } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';

const props = defineProps(['data', 'type'])

const data = reactive({
    name: props.data.name
})

</script>

<template>
    <div class="custom-node">
        <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" />
        <div class="flex items-center gap-x-2">
            <div class="p-2 rounded bg-purple-500">
                <LayoutGrid :size="16" color="white" />
            </div> <input class="nodrag text-purple-500" type="text" placeholder="Enter product name"
                v-model="data.name" />
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
