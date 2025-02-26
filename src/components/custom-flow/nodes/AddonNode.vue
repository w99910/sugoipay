<script lang="ts" setup>
import { Handle, Position, useVueFlow, type Connection } from '@vue-flow/core'
import { DiamondPlus } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
const props = defineProps(['data'])

const data = reactive({
    name: props.data.name
})

const { findNode } = useVueFlow();

function isValidConnection(connection: Connection) {
    const targetNode = findNode(connection.target);
    if (!targetNode) {
        return false;
    }
    return targetNode.type === 'product';
}
</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" :is-valid-connection="isValidConnection" />
        <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" />
        <div class="flex items-center gap-x-2">
            <div class="p-2 rounded bg-[#99d98c]">
                <DiamondPlus :size="16" color="white" />
            </div> <input class="nodrag text-[#99d98c]" type="text" placeholder="Enter addon name"
                v-model="data.name" />
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
