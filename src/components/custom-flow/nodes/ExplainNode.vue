<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { Text } from 'lucide-vue-next';
import { reactive } from 'vue'
// import Collisp
const props = defineProps(['data'])

const data = reactive({
})

</script>

<template>
    <div class="custom-node">
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#f79d65]">
                <Text :size="common.iconSize" color="white" />
            </div> <span class="text-[#f79d65] font-semibold text-sm pr-2">Explain</span>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
