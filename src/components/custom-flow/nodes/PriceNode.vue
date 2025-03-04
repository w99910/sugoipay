<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { DollarSign } from 'lucide-vue-next';
import { onMounted, reactive } from 'vue'

import { useVueFlow } from '@vue-flow/core';
import SearchNodes from '../SearchNodes.vue';
// import Collisp
const props = defineProps(['data', 'id'])

const _data = reactive({
    price: null,
})

onMounted(() => {
    const { updateNodeData } = useVueFlow();
    updateNodeData(props.id, {
        options: _data
    })
})

function select() {

}

// When feature is set as metered, this node cannot be used

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <div class="flex items-center gap-x-2 bg-gray-600 p-1.5">
            <div class="p-2 rounded bg-gray-500">
                <DollarSign :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Stripe Price</span>
        </div>
        <div class="flex flex-col gap-y-4 p-4 items-start">
            <SearchNodes :disable-icon="true" placeholder="Search Stripe Price ID" @select="select"
                :data="['price 1', 'price 2']" />
        </div>

        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
