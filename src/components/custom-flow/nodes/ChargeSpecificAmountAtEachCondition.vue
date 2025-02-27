<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { BadgeCent } from 'lucide-vue-next';
import { reactive } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer';
// import Collisp
const props = defineProps(['data'])

const data = reactive({
})

</script>

<template>
    <div class="custom-node">
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5 min-w-80">
            <div class="p-2 rounded bg-[#3753d1]">
                <BadgeCent :size="common.iconSize" color="white" />
            </div>
            <div class="text-[#3753d1] font-semibold text-sm whitespace-nowrap">Charge Specific Amount At Each
                Condition</div>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
