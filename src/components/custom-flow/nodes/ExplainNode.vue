<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { Text } from 'lucide-vue-next';
import { reactive } from 'vue'
// import Collisp
const props = defineProps(['data', 'id'])

const data = reactive({
})

console.log('mounted explain node')


</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <div class="flex items-center gap-x-2 bg-teal-700 p-1.5">
            <div class="p-2 rounded bg-teal-500">
                <Text :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Explain</span>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
