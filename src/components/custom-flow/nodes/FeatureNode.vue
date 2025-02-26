<script lang="ts" setup>
import { Handle, Position, type Connection, useVueFlow } from '@vue-flow/core'
import { Shield } from 'lucide-vue-next';
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
    return ['plan', 'addon'].includes(targetNode.type);
}

</script>

<template>
    <div class="custom-node">
        <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" />
        <div class="flex items-center gap-x-2">
            <div class="p-2 rounded bg-[#1e6091]">
                <Shield :size="16" color="white" />
            </div> <input class="nodrag text-[#1e6091]" type="text" placeholder="Enter feature name"
                v-model="data.name" />
        </div>
        <Handle type="source" :position="Position.Top" :is-valid-connection="isValidConnection" />
    </div>
</template>

<style></style>
