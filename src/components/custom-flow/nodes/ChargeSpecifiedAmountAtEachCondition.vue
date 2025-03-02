<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { BadgeCent } from 'lucide-vue-next';
import { reactive, onMounted } from 'vue'
import { useVueFlow } from '@vue-flow/core';
// import Collisp
const props = defineProps(['data', 'id'])

const data = reactive({
})

console.log('mounted charge specific amount node')

onMounted(() => {
    const { updateNodeData } = useVueFlow();
    updateNodeData(props.id, {
        options: data
    })
})

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-blue-600 p-1.5 min-w-80">
            <div class="p-2 rounded bg-blue-500">
                <BadgeCent :size="common.iconSize" color="white" />
            </div>
            <div class="text-white font-semibold text-sm whitespace-nowrap">Charge Specified Amount At Each
                Condition</div>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
