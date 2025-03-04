<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position } from '@vue-flow/core'
import { UserRoundPen } from 'lucide-vue-next';
import { onMounted, reactive } from 'vue'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { useVueFlow } from '@vue-flow/core';
// import Collisp
const props = defineProps(['data', 'id'])

const data = reactive({
    perUnit: props.data.options?.perUnit ?? 10,
})

onMounted(() => {
    const { updateNodeData } = useVueFlow();
    updateNodeData(props.id, {
        options: data
    })
})

// When feature is set as metered, this node cannot be used

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-blue-600 p-1.5">
            <div class="p-2 rounded bg-blue-500">
                <UserRoundPen :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Let Customer Select Quantity</span>
        </div>
        <div class="flex flex-col gap-y-4 p-4 items-start">
            <div class="flex items-center justify-between w-full">
                <label class="w-4/12 text-left label-text">Price Per Unit </label>
                <span class="w-12">:</span>
                <div class="w-[200px] flex">
                    <NumberField class="nodrag" v-model="data.perUnit" :step="0.1" :default-value="1" :format-options="{
                        style: 'currency',
                        currency: 'USD',
                        currencyDisplay: 'code',
                        currencySign: 'accounting',
                        maximumFractionDigits: 3
                    }">
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput class="label-input" />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>
            </div>
        </div>

        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
