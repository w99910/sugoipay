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
    minimum: 0,
    maximum: -1,
})

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
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-blue-600 p-1.5">
            <div class="p-2 rounded bg-blue-500">
                <UserRoundPen :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Let Customer Select Quantity</span>
        </div>
        <div class="flex flex-col gap-y-4 p-4 items-start">
            <div class="flex items-center gap-x-2">
                <span class="label-text">Minimum Quantity </span>
                <NumberField class="nodrag w-[150px] max-w-max" v-model="data.minimum" :default-value="10" :min="1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput class="label-input" />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
            <div class="flex items-center gap-x-2">
                <span class="label-text">Maximum Quantity </span>
                <NumberField class="nodrag w-[150px] max-w-max" v-model="data.maximum" :default-value="-1" :min="1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput class="label-input" />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
        </div>

        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
