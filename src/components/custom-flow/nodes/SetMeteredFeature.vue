<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { Table } from 'lucide-vue-next';
import { onMounted, reactive } from 'vue'
// import Collisp
const props = defineProps(['data', 'id'])

const { updateNodeData } = useVueFlow();

const data = reactive({
})


onMounted(() => {
    updateNodeData(props.id, {
        options: {
            isMeteredFeature: true,
        }
    })
})

</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <Table :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm pr-2">Set Metered Feature</span>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
