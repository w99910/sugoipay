<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { UserRoundPen } from 'lucide-vue-next';
import { reactive } from 'vue'
// import Collisp
const props = defineProps(['data'])

const data = reactive({
})

</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <UserRoundPen :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm pr-2">Let Customer Select Quantity</span>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
